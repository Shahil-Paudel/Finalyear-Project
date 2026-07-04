"""
Hybrid Recommendation Engine for HomeNest
==========================================
Combines two signals into one ranked list of product suggestions
for a given household:

1. Content-based filtering   (TF-IDF + cosine similarity on product text)
2. Collaborative filtering   (matrix factorization over household x product matrix)

Usage:
    from apps.recommendations.engine import HybridRecommender
    recs = HybridRecommender().recommend_for_household(household_id, top_n=10)
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds

from apps.products.models import Product, Interaction


class HybridRecommender:
    def __init__(self, w_content=0.5, w_collab=0.5):
        self.w_content = w_content
        self.w_collab = w_collab

    # ---------- 1. CONTENT-BASED FILTERING ----------
    def _content_scores(self, household_id):
        products = list(Product.objects.all())
        if not products:
            return {}

        texts = [(p.tags or "").replace(",", " ") for p in products]
        ids = [p.id for p in products]

        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(texts)

        # products this household has purchased -> build a "profile vector"
        purchased_ids = set(
            Interaction.objects.filter(household_id=household_id, action="purchase")
            .values_list("product_id", flat=True)
        )
        if not purchased_ids:
            return {pid: 0.0 for pid in ids}

        idx_map = {pid: i for i, pid in enumerate(ids)}
        purchased_idx = [idx_map[pid] for pid in purchased_ids if pid in idx_map]
        if not purchased_idx:
            return {pid: 0.0 for pid in ids}

        household_profile = tfidf_matrix[purchased_idx].mean(axis=0)
        household_profile = np.asarray(household_profile)
        sims = cosine_similarity(household_profile, tfidf_matrix).flatten()
        for pid, score in zip(ids, sims):
         print(f"Product ID: {pid}, Similarity: {score}")
        return {pid: float(sims[i]) for pid, i in idx_map.items()}
       

        # ---------- CONTENT-ONLY RECOMMENDATIONS ----------
    def content_recommend_for_household(self, household_id, top_n=10):
        """
        Returns recommendations using only Content-Based Filtering
        (TF-IDF + Cosine Similarity).
        """
        scores = self._content_scores(household_id)
        purchased_ids = set(
        Interaction.objects.filter(
        household_id=household_id,
        action="purchase"
        ).values_list("product_id", flat=True)
)

        # Sort by similarity score (highest first)
        sorted_scores = sorted(
         [
           (pid, score)
            for pid, score in scores.items()
            if score > 0 and pid not in purchased_ids
        ],
        key=lambda x: x[1],
        reverse=True,
)

        # Get top N product IDs
        top_ids = [pid for pid, score in sorted_scores[:top_n]]

        # Fetch products while preserving order
        products = Product.objects.filter(id__in=top_ids)
        products_by_id = {p.id: p for p in products}

        return [
            products_by_id[pid]
            for pid in top_ids
            if pid in products_by_id
        ]
    

    # ---------- 2. COLLABORATIVE FILTERING ----------
    def _collaborative_scores(self, household_id):
        interactions = Interaction.objects.filter(action__in=["purchase", "rating"]).values(
            "household_id", "product_id", "rating"
        )
        df = pd.DataFrame(list(interactions))
        if df.empty:
            return {}

        # implicit weight: purchase=3, rating=explicit value
        df["weight"] = df["rating"].fillna(3)

        matrix = df.pivot_table(
            index="household_id", columns="product_id", values="weight", aggfunc="mean"
        ).fillna(0)

        if household_id not in matrix.index or matrix.shape[1] < 2:
            return {}

        # matrix factorization (SVD) — k must be < min(matrix.shape)
        k = min(10, min(matrix.shape) - 1)
        if k < 1:
            return {}

        U, sigma, Vt = svds(matrix.values.astype(float), k=k)
        sigma = np.diag(sigma)
        predicted = np.dot(np.dot(U, sigma), Vt)
        pred_df = pd.DataFrame(predicted, index=matrix.index, columns=matrix.columns)

        row = pred_df.loc[household_id]
        # normalize to 0-1
        if row.max() > row.min():
            row = (row - row.min()) / (row.max() - row.min())
        return row.to_dict()

    # ---------- COMBINE ----------
    def recommend_for_household(self, household_id, top_n=10):
        content = self._content_scores(household_id)
        collab = self._collaborative_scores(household_id)

        all_ids = set(content) | set(collab) | set(Product.objects.values_list("id", flat=True))

        results = []
        for pid in all_ids:
            score = self.w_content * content.get(pid, 0) + self.w_collab * collab.get(pid, 0)
            results.append((pid, score))

        results.sort(key=lambda x: x[1], reverse=True)
        top_ids = [pid for pid, _ in results[:top_n]]

        products = Product.objects.filter(id__in=top_ids)
        products_by_id = {p.id: p for p in products}
        return [products_by_id[pid] for pid in top_ids if pid in products_by_id]
