import numpy as np


def cosine(a, b):
    """
    Compute cosine similarity between two vectors.
    Handles zero vectors safely.
    """

    denom = np.linalg.norm(a) * np.linalg.norm(b)

    if denom == 0:
        return 0.0

    return np.dot(a, b) / denom

def get_combined_interests(user):
    parts = []
    if user.skills:
        parts.append(user.skills)
    if user.interests:
        parts.append(user.interests)
    return ", ".join(parts)