# Import required libraries
# nltk: Natural Language Processing toolkit
# wordcloud: For creating the word cloud visualization
# matplotlib: For plotting and saving the image
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Download necessary NLTK data packages
# punkt: For tokenization
# stopwords: Common words to filter out (e.g., 'the', 'is', 'at')
# wordnet: For lemmatization
# averaged_perceptron_tagger: Required for lemmatization
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

# Read the input text file
# Using UTF-8 encoding to properly handle special characters
with open('Wordcloud/Projects_abstracts.txt', 'r', encoding='utf-8') as file:
    text = file.read()

# Text Preprocessing Step 1: Tokenization
# Split the text into individual words/tokens
tokens = word_tokenize(text)

# Text Preprocessing Step 2: Lowercase conversion
# Convert all words to lowercase for consistency
tokens = [word.lower() for word in tokens]

# Text Preprocessing Step 3: Remove stopwords and non-alphabetic tokens
# stopwords are common words like 'the', 'is', 'at' that don't add meaning
# Also remove numbers, punctuation, etc. by keeping only alphabetic tokens
stop_words = set(stopwords.words('english'))
# Add custom stopwords relevant to research projects
stop_words.add('project')
tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

# Text Preprocessing Step 4: Lemmatization
# Reduce words to their base/dictionary form
# e.g., 'running' -> 'run', 'better' -> 'good'
lemmatizer = WordNetLemmatizer()
lemmatized_tokens = [lemmatizer.lemmatize(word) for word in tokens]

# Join the processed tokens back into a single string
# WordCloud generator requires a string input
processed_text = ' '.join(lemmatized_tokens)

# Create the WordCloud object with specified parameters
# width, height: Size of the output image
# background_color=None and mode='RGBA': Enable transparency
# min_font_size: Minimum size for words to be displayed
wordcloud = WordCloud(width=1600, height=800, 
                     background_color=None,
                     mode='RGBA',
                     min_font_size=10).generate(processed_text)

# Set up the matplotlib figure
# figsize: Size of the figure in inches
# facecolor='none': Make plot background transparent
plt.figure(figsize=(20,10), facecolor='none')

# Display the wordcloud
# interpolation='bilinear': Smoothing between pixels
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')  # Hide the axes
plt.tight_layout(pad=0)  # Remove padding around the plot

# Save the final wordcloud
# dpi=300: High resolution output
# bbox_inches='tight': Remove extra whitespace
# transparent=True: Preserve transparency in saved file
plt.savefig('Wordcloud/wordcloud.png', dpi=300, bbox_inches='tight', transparent=True)
plt.close()  # Close the plot to free memory 