import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import json
from collections import Counter
import os

# Download necessary NLTK data packages
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

def process_text(text):
    # Tokenization and lowercase conversion
    tokens = word_tokenize(text.lower())

    # Remove stopwords and non-alphabetic tokens
    stop_words = set(stopwords.words('english'))
    # Add custom stopwords relevant to the dataset
    custom_stops = {'project', 'research', 'study', 'analysis', 'data', 'also'}
    stop_words.update(custom_stops)
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in tokens]

    return lemmatized_tokens

def save_word_frequencies(word_freq, output_filename):
    # Convert to list of objects for D3.js
    word_data = [{"text": word, "size": count} for word, count in word_freq.most_common(100)]
    
    # Save to JSON file
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(word_data, f, ensure_ascii=False, indent=2)

def main():
    # Define input files
    files = [
        'State_Society.txt',
        'Lives_Ecologies.txt',
        'Religion-Intellectual-Culture.txt'
    ]
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Process each file individually
    all_tokens = []
    for filename in files:
        file_path = os.path.join(current_dir, filename)
        
        # Read and process the file
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        
        tokens = process_text(text)
        all_tokens.extend(tokens)  # Add tokens to combined list
        
        # Generate individual word frequencies
        word_freq = Counter(tokens)
        output_filename = os.path.join(current_dir, f'word_frequencies_{os.path.splitext(filename)[0]}.json')
        save_word_frequencies(word_freq, output_filename)
    
    # Generate combined word frequencies
    combined_freq = Counter(all_tokens)
    combined_output = os.path.join(current_dir, 'word_frequencies_combined.json')
    save_word_frequencies(combined_freq, combined_output)

if __name__ == "__main__":
    main() 