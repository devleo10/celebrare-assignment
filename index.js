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
        allowTouchMove: false, // Disables drag/swipe
    mousewheel: false, 
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
                    makeElementDraggable(newParagraph); // Make the new text draggable
                }

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
            activeTextElement.style.fontSize = fontSizeInput.value + 'px';
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
    const makeElementDraggable = (element) => {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', dragElement);
            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.removeEventListener('mousemove', dragElement);
            });
        });

        const dragElement = (e) => {
            if (isDragging) {
                const swiperSlide = element.closest('.swiper-slide');
                const slideRect = swiperSlide.getBoundingClientRect();

                // Ensure element stays within slide bounds
                const left = Math.max(0, Math.min(e.clientX - offsetX, slideRect.width - element.offsetWidth));
                const top = Math.max(0, Math.min(e.clientY - offsetY, slideRect.height - element.offsetHeight));

                element.style.left = `${left}px`;
                element.style.top = `${top}px`;
                element.style.position = 'absolute';
            }
        };
    };

    // Make initial overlay texts draggable
    document.querySelectorAll('.overlay-text p').forEach(makeElementDraggable);

    // Delete text using the Delete key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' && activeTextElement) {
            activeTextElement.remove(); // Remove the active text element
            activeTextElement = null; // Reset the active element
            inputBox.value = ''; // Clear the input box
        }
    });
});