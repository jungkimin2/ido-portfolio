// 현재 선택된 미디어 인덱스
let currentMediaIndex = 0;
let galleryItems = [];

// 상영관 비디오 목록
const theaterVideos = [
    'videos/video1.mp4',
    'videos/video2.mp4',
    'videos/video3.mp4',
    'videos/video4.mp4'
];

// 상영관 비디오 재생
function playTheaterVideo(index) {
    const video = document.getElementById('theaterVideo');
    const selectors = document.querySelectorAll('.video-selector');

    // 모든 selector에서 active 제거
    selectors.forEach(s => s.classList.remove('active'));

    // 선택된 selector에 active 추가
    selectors[index].classList.add('active');

    // 비디오 소스 변경 및 재생
    video.src = theaterVideos[index];
    video.load();
    video.play();
}

// 페이지 로드 시 갤러리 아이템 수집
document.addEventListener('DOMContentLoaded', function() {
    galleryItems = Array.from(document.querySelectorAll('.photo-frame'));

    // 폴라로이드 프레임 애니메이션
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) rotate(0deg)';

        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';

            // 랜덤한 회전 각도 적용
            const rotation = (index % 3 === 0) ? -1 : (index % 3 === 1) ? 1 : -0.5;
            item.style.transform = `translateY(0) rotate(${rotation}deg)`;
        }, index * 50);
    });

    // 모바일에서만 영상 섹션 5초 후 등장
    const theaterSection = document.querySelector('.theater-section');
    const isMobile = window.innerWidth <= 768;

    if (theaterSection && isMobile) {
        // 모바일에서만 초기 숨김
        theaterSection.classList.add('mobile-hidden');

        // 5초 후 천천히 나타남
        setTimeout(() => {
            theaterSection.classList.remove('mobile-hidden');
            theaterSection.classList.add('mobile-visible');
        }, 5000);
    }
});

// 모달 열기
function openModal(element) {
    const modal = document.getElementById('mediaModal');
    const modalImg = document.getElementById('modalImage');

    currentMediaIndex = galleryItems.indexOf(element);

    modal.classList.add('show');

    const img = element.querySelector('img');
    modalImg.src = img.src;

    // 스크롤 방지
    document.body.style.overflow = 'hidden';

    // 터치 제스처 지원
    addTouchSupport();
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('mediaModal');
    modal.classList.remove('show');

    // 스크롤 복원
    document.body.style.overflow = 'auto';
}

// 이전 미디어
function prevMedia() {
    currentMediaIndex = (currentMediaIndex - 1 + galleryItems.length) % galleryItems.length;
    updateModalMedia('prev');
}

// 다음 미디어
function nextMedia() {
    currentMediaIndex = (currentMediaIndex + 1) % galleryItems.length;
    updateModalMedia('next');
}

// 모달 미디어 업데이트
function updateModalMedia(direction = 'next') {
    const modalImg = document.getElementById('modalImage');
    const currentItem = galleryItems[currentMediaIndex];

    // 부드러운 슬라이드 + 페이드 효과
    const startTransform = direction === 'next' ? 'translateX(100px) scale(0.95)' : 'translateX(-100px) scale(0.95)';

    modalImg.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    modalImg.style.opacity = '0';
    modalImg.style.transform = startTransform;

    setTimeout(() => {
        const img = currentItem.querySelector('img');
        modalImg.src = img.src;

        setTimeout(() => {
            modalImg.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'translateX(0) scale(1)';
        }, 50);
    }, 500);
}

// 키보드 네비게이션
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('mediaModal');

    if (!modal.classList.contains('show')) return;

    switch(e.key) {
        case 'ArrowLeft':
            prevMedia();
            break;
        case 'ArrowRight':
            nextMedia();
            break;
        case 'Escape':
            closeModal();
            break;
    }
});

// 터치 제스처 지원
let touchStartX = 0;
let touchEndX = 0;
let touchHandlersAdded = false;

function addTouchSupport() {
    if (touchHandlersAdded) return; // 중복 등록 방지

    const modal = document.getElementById('mediaModal');

    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    touchHandlersAdded = true;
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 왼쪽으로 스와이프 - 다음 미디어
            nextMedia();
        } else {
            // 오른쪽으로 스와이프 - 이전 미디어
            prevMedia();
        }
    }
}

// 스크롤 애니메이션
const observeOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observeOptions);

// 섹션 애니메이션 - 은은하게
document.querySelectorAll('.meaning-section, .philosophy-section, .profile-section, .album-page').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
    observer.observe(section);
});
