var hpTimeline;
var last = 'HeartPhase.';
var moreText, mainText;

function endLoad() {
    var preloader = document.querySelector(".preloader");
    anime({
        targets: '.preloader',
        opacity: [1, 0],
        duration: 1600,
        loop: false,
        complete: function(anim) {
            preloader.style.display = 'none';
        }
    });
    mainText = document.querySelector('.mainText');
    moreText= document.querySelector('.moreText');
    hpTimeline = anime.timeline({loop: true});
    hpTimeline.add({
        targets: '.video-overlay-main',scale: [1 , 1.15],
        duration: 100,
        delay: 800
    }).add({
        targets: '.video-overlay-main',scale: [1.15 , 1],
        duration: 400,
    })
}

function changeToIcon(e) {
    let item = e.getAttribute("str");
    try {
        document.querySelector("#title-list-heartphase-activated").id = "title-list-heartphase";
    } catch {};
    if (item != last) {
        mainText.innerHTML = "Power of heart";
        moreText.innerHTML = "";
        anime({
            targets: '.video-overlay-main, .video-overlay-more',
            scale: [.5, 1],
            duration: 800,
            loop: false
        });
        hpTimeline.play();
        last = item;
    }
}

function _changeMainText(e) {
    setTimeout(() => {
        changeMainText(e);
    }, 200);
}

function changeMainText(e) {
    let item = e.getAttribute("str");
    hpTimeline.pause();
    try {
        document.querySelector("#title-list-heartphase").id = "title-list-heartphase-activated";
    } catch {};
    if (item != last) {
        let mainStr, moreStr;
        switch(item) {
            case "Studio":
                mainStr = "Instantiate Thoughts";
                moreStr = "More about HeartPhase.Studio,";
                break;
            case "Web":
                mainStr = "Workspace Cohesion";
                moreStr = "More about HeartPhase.Web,";
                break;
            case "Tutorial":
                mainStr = "Knowledge Exchange";
                moreStr = "More about HeartPhase.Tutorial,";
                break;
            case "Community":
                mainStr = "Meet great minds";
                moreStr = "More about HeartPhase.Community,";
                break;
        }
        mainText.innerHTML = mainStr;
        moreText.innerHTML = moreStr;
        anime({
            targets: '.video-overlay-main, .video-overlay-more',
            scale: [.5, 1],
            duration: 800,
            loop: false
        });
        last = item;
    }
}



