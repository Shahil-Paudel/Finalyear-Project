"""
Classic algorithm implementations required by the project brief.
Used for sorting/searching the product catalog (e.g. sort by price,
then binary-search for a product within a target price or by name).

Both are implemented from scratch (no built-in sort/search) so they can
be shown and explained directly in the project report/viva.
"""


def merge_sort(items, key=lambda x: x):
    """
    Sorts a list in ascending order using merge sort. O(n log n).
    `items`: list of objects (e.g. Product instances or dicts)
    `key`: function extracting the comparable value from each item
    Returns a new sorted list (does not mutate the input).
    """
    if len(items) <= 1:
        return list(items)

    mid = len(items) // 2
    left = merge_sort(items[:mid], key)
    right = merge_sort(items[mid:], key)
    return _merge(left, right, key)


def _merge(left, right, key):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if key(left[i]) <= key(right[j]):
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


def binary_search(sorted_items, target, key=lambda x: x):
    """
    Searches a list that is ALREADY sorted (ascending, by `key`) for an
    item whose key equals `target`. O(log n).
    Returns the matching item, or None if not found.

    NOTE: run merge_sort() first if the data isn't guaranteed sorted.
    """
    low, high = 0, len(sorted_items) - 1

    while low <= high:
        mid = (low + high) // 2
        mid_val = key(sorted_items[mid])

        if mid_val == target:
            return sorted_items[mid]
        elif mid_val < target:
            low = mid + 1
        else:
            high = mid - 1

    return None


def binary_search_prefix(sorted_items, prefix, key=lambda x: x):
    """
    Variant used for name search: finds the left boundary of items whose
    key starts with `prefix` in a list sorted alphabetically by `key`.
    Returns a list of all matching items (still O(log n + k) where k = matches).
    """
    low, high = 0, len(sorted_items)
    prefix_lower = prefix.lower()

    # binary search for the first index where key(item) >= prefix
    while low < high:
        mid = (low + high) // 2
        if key(sorted_items[mid]).lower() < prefix_lower:
            low = mid + 1
        else:
            high = mid

    matches = []
    i = low
    while i < len(sorted_items) and key(sorted_items[i]).lower().startswith(prefix_lower):
        matches.append(sorted_items[i])
        i += 1
    return matches
