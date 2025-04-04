"""
Keyboard simulation module for AutoType.
This module handles simulating human-like typing patterns.
"""

import time
import random
from typing import Dict, List, Optional


def simulate_typing(text: str, typing_speed: int = 120, typo_rate: float = 0.0,
                   pause_after_comma: int = 500, pause_after_period: int = 1000,
                   random_hesitation: int = 500) -> None:
    """
    Simulate human-like typing of the given text.
    
    Args:
        text: Text to type
        typing_speed: Typing speed in words per minute
        typo_rate: Probability of making a typo (0.0 to 1.0)
        pause_after_comma: Pause after comma in milliseconds
        pause_after_period: Pause after period in milliseconds
        random_hesitation: Maximum random hesitation in milliseconds
    """
    # This is a placeholder that would be implemented with actual keyboard control
    # libraries like pyautogui or keyboard in a real implementation
    
    # Convert typing speed from WPM to characters per second
    # Assume average word length of 5 characters + 1 space
    chars_per_second = (typing_speed * 6) / 60
    
    # Base delay between keystrokes in seconds
    base_delay = 1.0 / chars_per_second
    
    for i, char in enumerate(text):
        # Check if we should make a typo
        if random.random() < typo_rate:
            # Simulate a typo by pressing a random adjacent key
            typo_char = get_adjacent_key(char)
            press_key(typo_char)
            
            # Pause briefly
            time.sleep(base_delay * 2)
            
            # Press backspace
            press_key('\b')
            
            # Pause briefly again
            time.sleep(base_delay * 1.5)
        
        # Press the actual key
        press_key(char)
        
        # Apply pauses based on punctuation
        if char == ',':
            time.sleep(pause_after_comma / 1000.0)
        elif char == '.':
            time.sleep(pause_after_period / 1000.0)
        elif char == ' ' and random.random() < 0.1:
            # Occasionally hesitate after spaces
            time.sleep((random.random() * random_hesitation) / 1000.0)
        else:
            # Normal typing delay with slight variation
            variation = random.uniform(0.8, 1.2)
            time.sleep(base_delay * variation)


def press_key(key: str) -> None:
    """
    Simulate pressing a key.
    
    Args:
        key: The key to press
    """
    # This is a placeholder that would use actual keyboard control libraries
    # in a real implementation
    pass


def get_adjacent_key(key: str) -> str:
    """
    Get a random adjacent key on a QWERTY keyboard.
    
    Args:
        key: The original key
    
    Returns:
        A random adjacent key
    """
    # QWERTY keyboard layout
    keyboard_layout = {
        'q': ['w', '1', 'a'],
        'w': ['q', 'e', '2', 'a', 's'],
        'e': ['w', 'r', '3', 's', 'd'],
        'r': ['e', 't', '4', 'd', 'f'],
        't': ['r', 'y', '5', 'f', 'g'],
        'y': ['t', 'u', '6', 'g', 'h'],
        'u': ['y', 'i', '7', 'h', 'j'],
        'i': ['u', 'o', '8', 'j', 'k'],
        'o': ['i', 'p', '9', 'k', 'l'],
        'p': ['o', '0', 'l', '['],
        'a': ['q', 'w', 's', 'z'],
        's': ['w', 'e', 'a', 'd', 'z', 'x'],
        'd': ['e', 'r', 's', 'f', 'x', 'c'],
        'f': ['r', 't', 'd', 'g', 'c', 'v'],
        'g': ['t', 'y', 'f', 'h', 'v', 'b'],
        'h': ['y', 'u', 'g', 'j', 'b', 'n'],
        'j': ['u', 'i', 'h', 'k', 'n', 'm'],
        'k': ['i', 'o', 'j', 'l', 'm', ','],
        'l': ['o', 'p', 'k', ';', ',', '.'],
        'z': ['a', 's', 'x'],
        'x': ['z', 's', 'd', 'c'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k', ','],
        ',': ['m', 'k', 'l', '.'],
        '.': [',', 'l', ';', '/'],
        ' ': [' ']  # Space only adjacent to itself
    }
    
    # Convert to lowercase for lookup
    key_lower = key.lower()
    
    # If key is not in our layout, return the original key
    if key_lower not in keyboard_layout:
        return key
    
    # Get adjacent keys
    adjacent_keys = keyboard_layout[key_lower]
    
    # Pick a random adjacent key
    typo_key = random.choice(adjacent_keys)
    
    # Maintain original case
    if key.isupper():
        typo_key = typo_key.upper()
    
    return typo_key 