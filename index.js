document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
      
    });

    // Get controls and slides
    const inputBox = document.querySelector('.input-box');
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeInput = document.getElementById('fontSize');
    const fontColorInput = document.getElementById('fontColor');
    const lineHeightSelect = document.getElementById('lineHeight');
    const boldButton = document.querySelector('button[onclick="formatText(\'bold\')"]');
    const italicButton = document.querySelector('button[onclick="formatText(\'italic\')"]');
    const underlineButton = document.querySelector('button[onclick="formatText(\'underline\')"]');
    
    // Alignment buttons
    const leftAlignButton = document.querySelector('button[onclick="changeTextAlign(\'left\')"]');
    const centerAlignButton = document.querySelector('button[onclick="changeTextAlign(\'center\')"]');
    const rightAlignButton = document.querySelector('button[onclick="changeTextAlign(\'right\')"]');

    const slideTexts = []; // Array to store text for each slide
    let activeTextElement = null; // Track the currently active text element

    // Function to get the active slide's overlay text element
    const getActiveOverlayText = () => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        return activeSlide.querySelector('.overlay-text');
    };

    // Update input box when the slide changes
    swiper.on('slideChange', () => {
        const currentIndex = swiper.realIndex;
        inputBox.value = slideTexts[currentIndex] || ''; // Show saved text or empty if none
    });

    // Handle Enter key to update existing text or add new text
    inputBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default behavior of Enter key (line break in input box)

            const newText = inputBox.value.trim();

            // Avoid appending text if it's empty or identical
            if (newText !== '') {
                if (activeTextElement) {
                    // Replace the text of the active text element
                    activeTextElement.textContent = newText;
                } else {
                    // If no active text element, create a new one
                    const newParagraph = document.createElement('p');
                    newParagraph.textContent = newText;
                    newParagraph.classList.add('new-text'); // Optional styling class

                    // Append the new paragraph to the slide's overlay
                    const overlay = getActiveOverlayText();
                    overlay.appendChild(newParagraph);
                }
                 make

                // Save the new text for the current slide (store it in an array)
                slideTexts[swiper.realIndex] = newText; // Store the updated text

                // Clear the input box for the next input
                inputBox.value = ''; // Clear the input box after adding/updating the text
            }
        }
    });

    // Handle click on an existing paragraph to set it as the active text element
    const setActiveText = (e) => {
        if (e.target.tagName === 'P') {
            activeTextElement = e.target; // Set the clicked paragraph as active
            inputBox.value = activeTextElement.textContent; // Load its content into the input box
        } else {
            activeTextElement = null; // Reset if clicking outside the paragraph
            inputBox.value = ''; // Clear the input box
        }
    };

    // Add click listener to overlay for selecting text
    document.querySelector('.swiper').addEventListener('click', (e) => setActiveText(e));

    // Font family change
    fontFamilySelect.addEventListener('change', () => {
        if (activeTextElement) {
            activeTextElement.style.fontFamily = fontFamilySelect.value;
        }
    });

    // Font size change
    fontSizeInput.addEventListener('input', () => {
        if (activeTextElement) {
            activeTextElement.style.fontSize = `${fontSizeInput.value}px`;
        }
    });

    // Font color change
    fontColorInput.addEventListener('input', () => {
        if (activeTextElement) {
            activeTextElement.style.color = fontColorInput.value;
        }
    });

    // Line height change
    lineHeightSelect.addEventListener('change', () => {
        if (activeTextElement) {
            activeTextElement.style.lineHeight = lineHeightSelect.value;
        }
    });

    // Toggle Bold, Italic, Underline
    const formatText = (command) => {
        if (activeTextElement) {
            if (command === 'bold') {
                activeTextElement.style.fontWeight = (activeTextElement.style.fontWeight === 'bold' || activeTextElement.style.fontWeight === '700') ? 'normal' : 'bold';
            } else if (command === 'italic') {
                activeTextElement.style.fontStyle = (activeTextElement.style.fontStyle === 'italic') ? 'normal' : 'italic';
            } else if (command === 'underline') {
                activeTextElement.style.textDecoration = (activeTextElement.style.textDecoration === 'underline') ? 'none' : 'underline';
            }
        }
    };

    boldButton.addEventListener('click', () => formatText('bold'));
    italicButton.addEventListener('click', () => formatText('italic'));
    underlineButton.addEventListener('click', () => formatText('underline'));

    // Text alignment function
    const changeTextAlign = (alignment) => {
        if (activeTextElement) {
            activeTextElement.style.textAlign = alignment; // Apply the alignment to the active text
        }
    };

    // Add event listeners for text alignment
    leftAlignButton.addEventListener('click', () => changeTextAlign('left'));
    centerAlignButton.addEventListener('click', () => changeTextAlign('center'));
    rightAlignButton.addEventListener('click', () => changeTextAlign('right'));

    // Function to make overlay text draggable
    let isDragging = false;
    let offsetX, offsetY;

    const overlayText = document.querySelector('.overlay-text');
    overlayText.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - overlayText.getBoundingClientRect().left;
        offsetY = e.clientY - overlayText.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragOverlayText);
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.removeEventListener('mousemove', dragOverlayText);
        });
    });

    function dragOverlayText(e) {
        if (isDragging) {
            const swiperSlide = overlayText.closest('.swiper-slide');
            const slideRect = swiperSlide.getBoundingClientRect();
            
            // Ensure overlay text stays within slide bounds
            const left = Math.max(0, Math.min(e.clientX - offsetX, slideRect.width - overlayText.offsetWidth));
            const top = Math.max(0, Math.min(e.clientY - offsetY, slideRect.height - overlayText.offsetHeight));

            overlayText.style.left = `${left}px`;
            overlayText.style.top = `${top}px`;
        }
    }
});
