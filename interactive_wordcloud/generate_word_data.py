#!/usr/bin/env python3
"""
Word Frequency Generator for Text Analysis

This script processes text files to generate word frequency data for visualization.
It performs text preprocessing (tokenization, lemmatization) and outputs JSON files
containing word frequencies that can be used to create word clouds using D3.js.

The script handles both individual file processing and combined analysis of all input files.
"""

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import json
from collections import Counter
import os

# Download required NLTK resources for text processing
nltk.download('punkt')  # For tokenization
nltk.download('stopwords')  # For removing common words
nltk.download('wordnet')  # For lemmatization
nltk.download('averaged_perceptron_tagger')  # For part-of-speech tagging

def process_text(text):
    """
    Process the input text through various NLP steps to prepare it for frequency analysis.
    
    Steps:
    1. Tokenization and conversion to lowercase
    2. Removal of stopwords and non-alphabetic tokens
    3. Lemmatization to reduce words to their base form
    
    Args:
        text (str): The input text to process
        
    Returns:
        list: A list of processed tokens ready for frequency analysis
    """
    # Tokenization and lowercase conversion
    tokens = word_tokenize(text.lower())

    # Remove stopwords and non-alphabetic tokens
    stop_words = set(stopwords.words('english'))
    # Add domain-specific stopwords that might skew the analysis
    custom_stops = {'project', 'research', 'study', 'analysis', 'data', 'also', 'within', 'including'}
    stop_words.update(custom_stops)
    
    # Filter out non-alphabetic tokens and stopwords
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

    # Lemmatization to reduce words to their base form (e.g., 'running' -> 'run')
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in tokens]

    return lemmatized_tokens

def save_word_frequencies(word_freq, output_filename):
    """
    Save word frequencies to a JSON file in a format suitable for D3.js visualization.
    
    Args:
        word_freq (Counter): Counter object containing word frequencies
        output_filename (str): Path where the JSON file will be saved
    """
    # Convert to list of objects for D3.js (limiting to top 100 words)
    word_data = [{"text": word, "size": count} for word, count in word_freq.most_common(100)]
    
    # Save to JSON file with proper formatting
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(word_data, f, ensure_ascii=False, indent=2)

def main():
    """
    Main execution function that:
    1. Processes each input file individually
    2. Generates individual word frequency JSON files
    3. Creates a combined analysis of all files
    """
    # Input files to process
    files = [
        'State_Society.txt',
        'Lives_Ecologies.txt',
        'Religion-Intellectual-Culture.txt'
    ]
    
    # Get the directory where the script is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Process each file individually and maintain a combined list
    all_tokens = []
    for filename in files:
        file_path = os.path.join(current_dir, filename)
        
        # Read and process each file
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        
        tokens = process_text(text)
        all_tokens.extend(tokens)  # Accumulate tokens for combined analysis
        
        # Generate and save individual word frequencies
        word_freq = Counter(tokens)
        output_filename = os.path.join(current_dir, f'word_frequencies_{os.path.splitext(filename)[0]}.json')
        save_word_frequencies(word_freq, output_filename)
    
    # Generate and save combined word frequencies
    combined_freq = Counter(all_tokens)
    combined_output = os.path.join(current_dir, 'word_frequencies_combined.json')
    save_word_frequencies(combined_freq, combined_output)

if __name__ == "__main__":
    main() 