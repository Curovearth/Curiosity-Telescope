document.addEventListener('DOMContentLoaded', () => {
    // --- 1. NAVIGATION LOGIC ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.doc-section');
    const progressBar = document.getElementById('progress-bar');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');

            // Update Sidebar Highlight
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Progress Bar Animation
            progressBar.style.width = '100%';
            
            // Switch Sections
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            window.scrollTo(0, 0);

            setTimeout(() => {
                progressBar.style.width = '0%';
                // Refresh gallery list whenever we switch chapters
                refreshImageListeners(); 
            }, 500);
        });
    });

    // --- 2. IMAGE GALLERY & ZOOM LOGIC ---
    const overlay = document.getElementById('image-overlay');
    const zoomedImg = document.getElementById('zoomed-image');
    const captionText = document.getElementById('overlay-caption');
    
    let currentIndex = 0;
    let allImages = [];

    function updateOverlay(index) {
        if (index >= 0 && index < allImages.length) {
            currentIndex = index;
            const img = allImages[currentIndex];
            zoomedImg.src = img.src;

            // Dynamic Caption based on label or title
            const container = img.closest('.photo-card, .img-container, .modern-card');
            const label = container ? container.querySelector('.photo-label, .blueprint-label, h2') : null;
            captionText.innerText = label ? label.innerText : `IMAGE ${currentIndex + 1} // AP-9`;
        }
    }

    function refreshImageListeners() {
        // Collect only images visible in the current section
        allImages = Array.from(document.querySelectorAll('.doc-section.active .report-img, .doc-section.active .photo-card img'));
        
        allImages.forEach((img, index) => {
            img.onclick = () => {
                overlay.style.display = "flex";
                overlay.style.flexDirection = "column";
                overlay.style.justifyContent = "center";
                updateOverlay(index);
            };
        });
    }

    // Initialize listeners on first load
    refreshImageListeners();

    // Arrow Key Navigation
    document.addEventListener('keydown', (e) => {
        if (overlay.style.display === "flex") {
            if (e.key === "ArrowRight") {
                updateOverlay((currentIndex + 1) % allImages.length);
            } else if (e.key === "ArrowLeft") {
                updateOverlay((currentIndex - 1 + allImages.length) % allImages.length);
            } else if (e.key === "Escape") {
                overlay.style.display = "none";
            }
        }
    });

    // Close Overlay on click outside image
    overlay.onclick = (e) => {
        if (e.target !== zoomedImg) {
            overlay.style.display = "none";
        }
    };
    function generateTOC() {
    const tocList = document.getElementById('help-toc');
    const headers = document.querySelectorAll('#testing h3');
    
    // Clear existing list to prevent duplicates
    tocList.innerHTML = "";

    headers.forEach((header) => {
        // If the <h3> doesn't have an ID, create one from the text
        if (!header.id) {
            header.id = header.innerText.toLowerCase().replace(/\s+/g, '-').replace(/[?>]/g, '');
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = `#${header.id}`;
        a.innerText = header.innerText.replace('>> ', ''); // Clean up the ">>" for the index
        
        // Smooth scroll effect
        a.addEventListener('click', (e) => {
            e.preventDefault();
            header.scrollIntoView({ behavior: 'smooth' });
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });
}
// Call this inside your existing navigation click event 
// or at the end of the script to initialize it.
generateTOC();

});

// --- 3. VIDEO AUTO-PLAY LOGIC ---
window.addEventListener('load', () => {
    const video = document.getElementById('lunar-video');
    if (video) {
        video.play().catch(error => {
            console.log("Autoplay blocked: Browser requires user interaction for audio.");
        });
    }
});

