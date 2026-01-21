document.addEventListener('DOMContentLoaded', () => {
    console.log("🐲 Greeting Card Script Loaded: v80 - Final");

    // Set Date
    const dateEl = document.getElementById('cardDate');
    if (dateEl) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const yearShort = String(year).slice(-2);
        // Film style: ' 26  01  22
        dateEl.textContent = `' ${yearShort}  ${month}  ${day}`;
    }
    // DOM Elements
    const card = document.getElementById('greetingCard');
    const recipientNameEl = document.getElementById('recipientName');
    const senderNameEl = document.getElementById('senderName');
    // const fabShareBtn = document.getElementById('fabShareBtn'); // Removed
    const shareModal = document.getElementById('shareModal');
    const closeModal = document.querySelector('.close-btn');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    // const previewBtn = document.getElementById('previewBtn'); // Removed
    const mainActionBtn = document.getElementById('mainActionBtn'); // Renamed
    const inputFrom = document.getElementById('inputFrom');
    const inputTo = document.getElementById('inputTo');
    const inputMsg = document.getElementById('inputMsg');
    const inputImage = document.getElementById('inputImage');
    const copyFeedback = document.getElementById('copyFeedback');
    const shareGuide = document.getElementById('shareGuide'); // New toast
    const closeGuide = document.querySelector('.close-guide');

    // --- On Load: Check for Share Guide Mode ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('share_guide') === 'true') {
        // user just clicked 'Send' and page reloaded
        // Show the guide
        if (shareGuide) {
            shareGuide.classList.remove('hidden');
            // Auto hide after 10 seconds (optional) or let user close
            closeGuide.addEventListener('click', () => {
                shareGuide.classList.add('hidden');
            });
            shareGuide.addEventListener('click', (e) => {
                if (e.target === shareGuide) shareGuide.classList.add('hidden');
            });
        }

        // Clean URL so the 'guide' param isn't shared
        urlParams.delete('share_guide');
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState(null, '', newUrl);
    }

    // Image Elements
    const imageContainer = document.getElementById('imageContainer');
    const greetingImage = document.getElementById('greetingImage');
    const greetingMessageEl = document.getElementById('greetingMessage');

    // --- Background Music Logic ---
    const bgm = document.getElementById('bgm');
    const musicControl = document.getElementById('musicControl');
    let isMusicPlaying = false;

    const toggleMusic = () => {
        if (bgm.paused) {
            bgm.play().then(() => {
                isMusicPlaying = true;
                musicControl.classList.add('playing');
            }).catch(err => console.log('Playback prevented', err));
        } else {
            bgm.pause();
            isMusicPlaying = false;
            musicControl.classList.remove('playing');
        }
    };

    if (musicControl) {
        musicControl.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // Auto-play attempt on first interaction
    const autoPlayMusic = () => {
        if (!isMusicPlaying) {
            toggleMusic();
            // Remove listener after first success
            document.removeEventListener('click', autoPlayMusic);
            document.removeEventListener('touchstart', autoPlayMusic);
        }
    };
    document.addEventListener('click', autoPlayMusic);
    document.addEventListener('touchstart', autoPlayMusic);


    let isOpen = false;

    // --- Personalization Logic ---
    // const urlParams = new URLSearchParams(window.location.search); // Already declared above
    const toName = urlParams.get('to');
    const fromName = urlParams.get('from');
    const imgUrl = urlParams.get('img');
    const msg = urlParams.get('msg');
    const bgmUrl = urlParams.get('bgm'); // New BGM param
    const imgPos = urlParams.get('imgpos'); // Image position param

    if (toName) recipientNameEl.textContent = toName;
    if (fromName) senderNameEl.textContent = fromName;

    // --- Apply Image Position ---
    if (imgPos && greetingImage) {
        greetingImage.style.objectPosition = imgPos;
    }

    // --- BGM Setup ---
    if (bgmUrl) {
        bgm.src = bgmUrl;
    }
    // Else it uses the default in HTML (bgm.mp3)

    // --- Dynamic Title for Sharing ---
    // Try to update the title/meta so when user shares from WeChat, it *might* pick up the personalized text.
    if (toName && fromName) {
        document.title = `To ${toName}: 2026 新年快乐!`;

        // Helper to update meta tags
        function updateMeta(property, content) {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (tag) tag.setAttribute('content', content);
        }

        updateMeta('og:title', `To ${toName}: 2026 新年快乐!`);
        updateMeta('og:description', `这是 ${fromName} 发来的新年祝福，快点开看看吧！✨`);
    }

    // Handle Custom Message & Typewriter Prep
    let fullGreetingHTML = '';
    if (msg) {
        // Convert newlines to <br> for HTML display
        fullGreetingHTML = msg.replace(/\n/g, '<br>');
    } else {
        // Default text
        fullGreetingHTML = '愿新的一年，<br>万事胜意，岁岁平安。<br>Happy New Year!';
    }

    // Set it initially but empty it for the effect
    greetingMessageEl.innerHTML = '';
    // We store the text to type in a variable, logic comes later

    // Image Handling
    const displayImg = imgUrl || 'default_cover.jpg';

    // Check if it's default to apply special fit
    if (!imgUrl || displayImg.includes('default_cover.jpg')) {
        greetingImage.classList.add('default-fit');
    } else {
        greetingImage.classList.remove('default-fit');
    }

    imageContainer.classList.remove('hidden');
    greetingImage.src = displayImg;

    // --- Typewriter Effect ---
    let isTyping = false;
    const typeWriter = (html, element, speed = 50) => {
        if (isTyping) return;
        isTyping = true;
        element.innerHTML = '';

        let i = 0;
        function type() {
            if (i < html.length) {
                // Check for HTML tag
                if (html.charAt(i) === '<') {
                    // Find the closing '>'
                    let tagClose = html.indexOf('>', i);
                    if (tagClose !== -1) {
                        element.innerHTML += html.substring(i, tagClose + 1);
                        i = tagClose + 1;
                    } else {
                        // Malformed, just print char
                        element.innerHTML += html.charAt(i);
                        i++;
                    }
                } else {
                    element.innerHTML += html.charAt(i);
                    i++;
                }
                setTimeout(type, speed);
            } else {
                isTyping = false;
            }
        }
        type();
    };


    // --- Interaction Logic ---
    card.addEventListener('click', (e) => {
        // Prevent closing if clicking inside the card's interactive elements
        if (e.target.closest('.share-section') || e.target.closest('#shareModal')) return;

        if (!isOpen) {
            isOpen = true;
            card.classList.add('open');
            triggerConfetti();

            // Show the action button (with delay)
            setTimeout(() => {
                if (mainActionBtn) mainActionBtn.classList.add('visible');
            }, 1500); // Appear 1.5s after card opens

            // Start Typewriter
            // Small delay to match the opening animation
            setTimeout(() => {
                typeWriter(fullGreetingHTML, greetingMessageEl, 100);
            }, 600);

        } else {
            // Optional: Click outside content to close?
            // For now, let's keep it open or toggle on the back face if we want.
            // card.classList.remove('open'); 
            // isOpen = false;
        }
    });

    // --- Confetti Effect ---
    function triggerConfetti() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // Open Modal Function
    const openModal = (e) => {
        if (e) e.stopPropagation(); // Prevent card from toggling
        shareModal.classList.remove('hidden');
    };

    // Attach listeners
    if (mainActionBtn) mainActionBtn.addEventListener('click', openModal);

    closeModal.addEventListener('click', () => {
        shareModal.classList.add('hidden');
        copyFeedback.textContent = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.add('hidden');
            copyFeedback.textContent = '';
        }
    });

    // --- Preview & Share Button Logic ---
    if (generateLinkBtn) {
        generateLinkBtn.addEventListener('click', () => {
            const fromVal = inputFrom.value.trim();
            const toVal = inputTo.value.trim();
            const imgVal = inputImage.value.trim();
            const msgVal = inputMsg.value.trim();

            // Validation
            if (!fromVal || !toVal) {
                alert('请填写"你的名字"和"朋友名字"！(Name fields are required)');
                return;
            }

            const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
            let newUrl = `${baseUrl}?to=${encodeURIComponent(toVal)}&from=${encodeURIComponent(fromVal)}`;

            if (imgVal) {
                newUrl += `&img=${encodeURIComponent(imgVal)}`;
            }

            if (msgVal) {
                newUrl += `&msg=${encodeURIComponent(msgVal)}`;
            }

            // Pass through BGM param if it exists
            const currentBgmParam = new URLSearchParams(window.location.search).get('bgm');
            if (currentBgmParam) {
                newUrl += `&bgm=${encodeURIComponent(currentBgmParam)}`;
            }

            // Get selected image position
            const activePos = document.querySelector('.pos-btn.active');
            if (activePos && imgVal) {
                newUrl += `&imgpos=${activePos.dataset.pos}`;
            }

            // Append share_guide flag
            newUrl += '&share_guide=true';

            copyFeedback.textContent = '✅ 准备跳转... (Redirecting...)';
            copyFeedback.style.color = "green";

            setTimeout(() => {
                window.location.href = newUrl;
            }, 500);
        });
    }

    // Upload Elements
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');

    const DEFAULT_API_KEY = '6ff086b63ecb224f55be5370ed528f95';

    // File Upload Logic
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simplify: Just use the default key directly or what's in local storage (if advanced user set it console)
        // For this user request, we just prioritize seamless experience.
        const apiKey = localStorage.getItem('imgbb_api_key') || DEFAULT_API_KEY;

        if (!apiKey) {
            // This shouldn't happen now since we have a default
            alert('API Key Error');
            return;
        }

        uploadStatus.textContent = '⏳ 正在上传... (Uploading...)';
        uploadStatus.style.color = 'blue';

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const url = data.data.url;
                inputImage.value = url; // Auto fill the URL
                uploadStatus.textContent = '✅ 上传成功！链接已填入。';
                uploadStatus.style.color = 'green';

                // Show position selector
                const imgPosGroup = document.getElementById('imgPosGroup');
                if (imgPosGroup) imgPosGroup.classList.remove('hidden');

                // Set preview image
                const imgPreview = document.getElementById('imgPreview');
                if (imgPreview) imgPreview.src = url;
            } else {
                throw new Error(data.error ? data.error.message : 'Upload failed');
            }
        } catch (err) {
            console.error(err);
            uploadStatus.textContent = '❌ 上传失败: ' + err.message;
            uploadStatus.style.color = 'red';
        }
    });

    // --- Position Button Click Handlers ---
    const posButtons = document.querySelectorAll('.pos-btn');
    const imgPreview = document.getElementById('imgPreview');
    posButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            posButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update preview image position
            if (imgPreview) {
                imgPreview.style.objectPosition = btn.dataset.pos;
            }
        });
    });

    // --- Preview Logic ---
    previewBtn.addEventListener('click', () => {
        const fromVal = inputFrom.value.trim() || 'Me';
        const toVal = inputTo.value.trim() || 'Friend';
        const imgVal = inputImage.value.trim();
        const msgVal = inputMsg.value.trim();

        // Update Card Content Locally
        recipientNameEl.textContent = toVal;
        senderNameEl.textContent = fromVal;

        if (msgVal) {
            greetingMessageEl.innerHTML = msgVal.replace(/\n/g, '<br>');
        } else {
            // Reset to default if empty
            greetingMessageEl.innerHTML = '愿新的一年，<br>万事胜意，岁岁平安。<br>Happy New Year!';
        }

        if (imgVal) {
            greetingImage.src = imgVal;
            greetingImage.classList.remove('default-fit'); // Remove contain mode for user images
            imageContainer.classList.remove('hidden');
        } else {
            imageContainer.classList.add('hidden');
        }

        // Close modal and ensure card is open
        shareModal.classList.add('hidden');
        if (!isOpen) {
            isOpen = true;
            card.classList.add('open');
            triggerConfetti();
        }

        copyFeedback.textContent = ''; // Clear any previous feedback
    });



    generateLinkBtn.addEventListener('click', () => {
        const fromVal = inputFrom.value.trim();
        const toVal = inputTo.value.trim();
        const imgVal = inputImage.value.trim();
        const msgVal = inputMsg.value.trim();

        // Validation
        if (!fromVal || !toVal) {
            alert('请填写“你的名字”和“朋友名字”！(Name fields are required)');
            return;
        }

        const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        let newUrl = `${baseUrl}?to=${encodeURIComponent(toVal)}&from=${encodeURIComponent(fromVal)}`;

        if (imgVal) {
            newUrl += `&img=${encodeURIComponent(imgVal)}`;
        }

        if (msgVal) {
            newUrl += `&msg=${encodeURIComponent(msgVal)}`;
        }

        // Add Image Position
        const activePosBtn = document.querySelector('.pos-btn.active');
        if (activePosBtn) {
            newUrl += `&imgpos=${encodeURIComponent(activePosBtn.dataset.pos)}`;
        }

        // Pass through BGM param if it exists (so shared card keeps the song)
        if (bgm.src && !bgm.src.endsWith('bgm.mp3')) {
            // Only append if it's a custom URL. 
            // Ideally we need an input for BGM in the modal, but for now we preserve it if set via URL.
            const currentBgmParam = new URLSearchParams(window.location.search).get('bgm');
            if (currentBgmParam) {
                newUrl += `&bgm=${encodeURIComponent(currentBgmParam)}`;
            }
        }

        if (msgVal) {
            newUrl += `&msg=${encodeURIComponent(msgVal)}`;
            // Visual update for message
            greetingMessageEl.innerHTML = msgVal.replace(/\n/g, '<br>');
        }

        // --- Visual Update (Immediate Feedback) ---
        if (toVal) recipientNameEl.textContent = toVal;
        if (fromVal) senderNameEl.textContent = fromVal;

        // CRITICAL UPDATE: Force Page Reload to Update WeChat Share Context
        // WeChat (and some other browsers) capture the page title/metadata ONLY on initial load.
        // Changing the URL state or document.title via JS often doesn't update the "Share Card" content.
        // To ensure the share card shows the NEW names, we must reload the page with the new URL.

        // Detect if the URL is actually changing to avoid unnecessary reloads
        // We ALWAYS reload now to show the guide, or we conditionally reload?
        // Let's force reload + guide to be consistent.

        copyFeedback.textContent = '✅ 更新成功！准备跳转... (Updating...)';
        copyFeedback.style.color = "green";

        // Append share_guide flag
        if (!newUrl.includes('share_guide')) {
            newUrl += '&share_guide=true';
        }

        setTimeout(() => {
            window.location.href = newUrl;
        }, 500);
        return;


        // If URL hasn't changed (user clicked send again), just show the copy/share logic

        // --- Share Logic ---
        // WeChat's browser often crashes or behaves unexpectedly with navigator.share
        // So we explicitly check for it.
        const isWeChat = /MicroMessenger/i.test(navigator.userAgent);

        if (navigator.share && !isWeChat) {
            // Native Share for non-WeChat Mobile Browsers
            navigator.share({
                title: `To ${toVal}: 2026 新年快乐!`,
                text: `这是 ${fromVal} 发来的新年祝福，快点开看看吧！✨`,
                url: newUrl
            }).then(() => {
                copyFeedback.textContent = '分享成功！(Shared Successfully)';
                copyFeedback.style.color = "green";
            }).catch((err) => {
                console.log('Share processed/cancelled:', err);
                fallbackCopy(newUrl);
            });
        } else {
            // WebView / WeChat / Desktop fallback
            fallbackCopy(newUrl);
        }

        function fallbackCopy(text) {
            navigator.clipboard.writeText(text).then(() => {
                if (isWeChat) {
                    copyFeedback.innerHTML = '已准备好！请点击右上角 <b>[...]</b> <br>选择 "发送给朋友" 以生成卡片';
                } else {
                    copyFeedback.textContent = '链接已复制！请粘贴给朋友 (Link Copied!)';
                }
                copyFeedback.style.color = "green";
            }).catch(err => {
                console.error('Failed to copy: ', err);
                copyFeedback.textContent = '复制失败，请手动复制地址栏连接';
                copyFeedback.style.color = "red";
            });
        }
    });
});

// --- Embedded Particle System ---
window.addEventListener('load', () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5 - 0.2;
            const shade = Math.random() > 0.5 ? '255, 215, 0' : '230, 230, 250'; // Gold/Light Lavender
            this.color = `rgba(${shade}, ${Math.random() * 0.5 + 0.4})`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < 0 - this.size) {
                this.y = canvas.height + this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 12; // High glow
            ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
    }

    initParticles();
    animateParticles();
});
