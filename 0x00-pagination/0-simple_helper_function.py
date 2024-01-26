#!/usr/bin/env python3

"""Module that create a helper function"""

from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Find the index range"""
    if page > -1:
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
    return (start_index, end_index)
