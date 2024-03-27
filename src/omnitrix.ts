import gsap from "gsap"

/* ---*--- CONSTANTS AND GLOBALS ---*--- */
const ALIENS = [
    "diamondhead",
    "fourarms",
    "ghostfreak",
    "greymatter",
    "heatblast",
    "ripjaws",
    "stinkfly",
    "upgrade",
    "wildmutt",
    "xlr8",
]
const imagesUrl = "./images/"
const ALIEN_IMAGES = {
    diamondhead: `${imagesUrl}diamondhead.svg`,
    fourarms: `${imagesUrl}fourarms.svg`,
    ghostfreak: `${imagesUrl}ghostfreak.svg`,
    greymatter: `${imagesUrl}greymatter.svg`,
    heatblast: `${imagesUrl}heatblast.svg`,
    ripjaws: `${imagesUrl}ripjaws.svg`,
    stinkfly: `${imagesUrl}stinkfly.svg`,
    upgrade: `${imagesUrl}upgrade.svg`,
    wildmutt: `${imagesUrl}wildmutt.svg`,
    xlr8: `${imagesUrl}xlr8.svg`,
}
const soundsUrl = "./sounds/"
const SOUNDS = {
    activation: `${soundsUrl}activation.mp3`,
    depleteTimeout: `${soundsUrl}deplete-timeout.mp3`,
    hoverAlien: `${soundsUrl}hover-alien.mp3`,
    recharged: `${soundsUrl}recharged.mp3`,
    timeout: `${soundsUrl}timeout.mp3`,
    transformation: `${soundsUrl}transformation.mp3`,
    twist1: `${soundsUrl}twist-1.mp3`,
    twist2: `${soundsUrl}twist-2.mp3`,
    twist3: `${soundsUrl}twist-3.mp3`,
    twist4: `${soundsUrl}twist-4.mp3`,
    twist5: `${soundsUrl}twist-5.mp3`,
    twist6: `${soundsUrl}twist-6.mp3`,
}
const videosUrl = "./videos/"
const VIDEOS = {
    diamondhead: `${videosUrl}diamondhead.mp4`,
    fourarms: `${videosUrl}fourarms.mp4`,
    ghostfreak: `${videosUrl}ghostfreak.mp4`,
    greymatter: `${videosUrl}greymatter.mp4`,
    heatblast: `${videosUrl}heatblast.mp4`,
    ripjaws: `${videosUrl}ripjaws.mp4`,
    stinkfly: `${videosUrl}stinkfly.mp4`,
    upgrade: `${videosUrl}upgrade.mp4`,
    wildmutt: `${videosUrl}wildmutt.mp4`,
    xlr8: `${videosUrl}xlr8.mp4`,
}

const YTUrlPrefix = "https://www.youtube.com/embed/"
const YTUrlSuffix = "&controls=0&autoplay=1&loop=1&mute=1"
const YT_VIDEOS = {
    diamondhead: `${YTUrlPrefix}nhsODdc9_6U?si=vBVhJPy6_qBzBTO7&start=35${YTUrlSuffix}`,
    fourarms: `${YTUrlPrefix}WKTybGFTi2Q?si=BpvQcoelnwTpgqQs&start=57${YTUrlSuffix}`,
    ghostfreak: `${YTUrlPrefix}I_xn1l2kkwU?si=G66ks2vjdeaCULDL&start=27${YTUrlSuffix}`,
    greymatter: `${YTUrlPrefix}6PwFIAJhi68?si=9ZoJAt8QjaxvjGtL&start=23${YTUrlSuffix}`,
    heatblast: `${YTUrlPrefix}XcS4WFPkEzA?si=pv4Oerx6BLLpuHOG&start=24${YTUrlSuffix}`,
    ripjaws: `${YTUrlPrefix}wgBBpYoJ9rA?si=qJapuVO6TZA1VRy6&start=41${YTUrlSuffix}`,
    stinkfly: `${YTUrlPrefix}Lburuz2Tjlo?si=GOr41JgO8umo0DXi&start=10${YTUrlSuffix}`,
    upgrade: `${YTUrlPrefix}7phs8Mdut3Q?si=uJ6qOKdBMLssJRvJ&start=16${YTUrlSuffix}`,
    wildmutt: `${YTUrlPrefix}qdE7ZMlIV8o?si=g6fgg-h3FWMmWa5C&start=105${YTUrlSuffix}`,
    xlr8: `${YTUrlPrefix}wHMMfAOHo7g?si=WBIoWkLGuk5aHU2X&start=174${YTUrlSuffix}`,
}

/* ---*--- DOM GLOBALS ---*--- */

const activateBtn: HTMLButtonElement = document.querySelector(".activate-btn")!
const watchFace: HTMLElement = document.querySelector(".alien-select")!
const dots: NodeListOf<HTMLElement> = document.querySelectorAll(".dot")!
const btnTop: HTMLElement = document.querySelector(".activate-btn > .top")!
const video: HTMLVideoElement = document.querySelector(".transformation-video")!
const heroBG: HTMLVideoElement = document.querySelector(".hero-bg")!
const overlay: HTMLElement = document.querySelector(".overlay")!
const alienImage: HTMLImageElement = document.querySelector(".alien")!

/* ---*--- AUDIO GLOBALS ---*--- */

const hoverAudio1 = new Audio(SOUNDS.hoverAlien)
const hoverAudio2 = new Audio(SOUNDS.hoverAlien)
const twistSound = new Audio()
const transformAudio = new Audio(SOUNDS.transformation)

/* ---*--- MISC GLOBALS ---*--- */

const scrollThreshold = 200 // 200 px scroll to rotate watch
const faceDisplacement = 115

/* ---*--- MUTABLE GLOBALS ---*--- */

let active = false
let recharged = true
let soundIdx = 0
let rotate = 0
let accumulatedScroll = 0
let lastDirection: "clockwise" | "counter-clockwise" | null = null
let alienIdx = 0
let alien = ALIENS[alienIdx]

/* ---*--- EVENT LISTENERS & USER INTERACTIONS ---*--- */

activateBtn.addEventListener("mousedown", () => {
    activateBtnDown()
})

activateBtn.addEventListener("mouseup", () => {
    activateBtnUp()
})

document.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "ArrowUp") && recharged) {
        activateBtnPress()
    } else if (e.key === "ArrowLeft" && active) {
        twistCounterClockWise()
    } else if (e.key === "ArrowRight" && active) {
        twistClockWise()
    } else if ((e.key === "Enter" || e.key === "ArrowDown") && active) {
        goHero()
    }
})

document.addEventListener(
    "wheel",
    (event) => {
        event.preventDefault() // no normal page scroll
        // so there is no extra long scroll when doing the opposite direction
        const currentDirection =
            event.deltaY > 0 ? "clockwise" : "counter-clockwise"
        if (lastDirection && currentDirection !== lastDirection) {
            accumulatedScroll = 0
        }
        lastDirection = currentDirection

        accumulatedScroll += event.deltaY
        if (Math.abs(accumulatedScroll) >= scrollThreshold && active) {
            const direction =
                accumulatedScroll > 0 ? "clockwise" : "counter-clockwise"
            if (direction === "clockwise") {
                twistClockWise()
            } else {
                twistCounterClockWise()
            }

            accumulatedScroll = 0
        }
    },
    { passive: false }
)

watchFace.addEventListener("click", () => {
    if (active && recharged) goHero()
})

// document.addEventListener("visibilitychange", function () {
//     if (document.hidden) {
//         video.pause()
//     } else {
//         video.play()
//     }
// })

/* ---*--- MAJOR EVENTS ---*--- */

function activate() {
    if (active || !recharged) return
    activateAnimation()
    active = true
    setTimeout(hoverSound, 800)
}

function activateAnimation() {
    const popUpDuration = 0.15
    const faceTransitionDuration = 0.5
    alienImage.src = ALIEN_IMAGES[alien as keyof typeof ALIEN_IMAGES]

    const audio = new Audio(SOUNDS.activation)
    audio.play()

    gsap.timeline()
        .to(".face", {
            y: -100,
            duration: popUpDuration,
            delay: 0.18,
        })
        .to(
            ".cylinder",
            {
                y: -70,
                duration: popUpDuration,
            },
            "<"
        )
        .to(".tri-left", {
            x: `+=${faceDisplacement}`,
            duration: faceTransitionDuration,
        })
        .to(
            ".tri-right",
            {
                x: `-=${faceDisplacement}`,
                duration: faceTransitionDuration,
            },
            "<"
        )
        .set(
            ".diamond",
            {
                opacity: 1,
            },
            "<0.07"
        )
        .to(
            ".diamond",
            {
                width: "80%",
                height: "80%",
                duration: faceTransitionDuration,
            },
            "<"
        )
        .to(".diamond > .alien", {
            opacity: 1,
            duration: 0.2,
        })
}

function goHero() {
    active = false
    recharged = false
    hoverAudio1.pause()
    hoverAudio1.currentTime = 0
    hoverAudio2.pause()
    hoverAudio2.currentTime = 0
    transformAudio.play()

    gsap.timeline()
        .to(".face", {
            y: -60,
            duration: 0.15,
        })
        .to(
            ".cylinder",
            {
                y: -30,
                duration: 0.15,
            },
            "<"
        )
        .set(".overlay", {
            display: "block",
        })
        .to(".overlay", {
            opacity: 1,
            duration: 0.2,
        })
        .to(
            "nav",
            {
                opacity: 0,
            },
            "<"
        )
        .set("nav", {
            display: "none",
        })
        .set(".transformation-video", {
            display: "block",
        })
        .call(transform)
        .set(".alien", {
            opacity: 0,
        })
        .set(".diamond", {
            width: 0,
            height: 0,
            opacity: 0,
        })
        .set(".tri-left", {
            x: `-=${faceDisplacement}`,
        })
        .set(".tri-right", {
            x: `+=${faceDisplacement}`,
        })
}

function transform() {
    video.src = VIDEOS[alien as keyof typeof VIDEOS]
    video.load()

    video.addEventListener("canplay", () => {
        video.play()

        // Fade out the overlay once the video starts playing
        gsap.to(".overlay", {
            opacity: 0,
            duration: 0.4,
        })

        // Handle video transition out
        video.addEventListener("timeupdate", videoTransitionOut)
    })

    setWatchColor("white")
    gsap.set(".base, .cylinder, .activate-btn, .dots", {
        opacity: 0,
    })

    video.onended = () => {
        gsap.timeline()
            .set(".transformation-video", {
                display: "none",
            })
            .to(".overlay", {
                opacity: 0,
                duration: 0.4,
            })
        timeout(10000)
    }
}

function timeout(duration: number) {
    setTimeout(() => {
        const audio = new Audio(SOUNDS.depleteTimeout)
        audio.play()

        gsap.timeline()
            .add(blinkRed(3, 3000))
            .add(blinkRed(3, 1500))
            .add(blinkRed(2, 1500))
            .call(() => {
                overlay.dataset.color = "red"
            })
            .to(".overlay", {
                opacity: 1,
                duration: 0.4,
            })
            .set(".base, .cylinder, .activate-btn, .dots", {
                opacity: 1,
            })
            .call(() => {
                heroBG.src = ""
                setWatchColor("red")
            })
            .to(".overlay", {
                opacity: 0,
                duration: 0.4,
                delay: 0.5,
            })
            .set(".overlay", {
                display: "none",
            })
            .set("nav", {
                display: "flex",
            })
            .to("nav", {
                opacity: 1,
            })
            .call(() => {
                recharge(3000)
            })
    }, duration)
}

function recharge(duration: number) {
    setTimeout(() => {
        const audio = new Audio(SOUNDS.recharged)
        audio.play()
        setWatchColor("green")
        recharged = true
        overlay.dataset.color = "green"
    }, duration)
}

/* ---*--- HELPERS ---*--- */

function hoverSound() {
    let currentPlayer = "a"

    function loop() {
        if (!active) return

        let player = null

        if (currentPlayer === "a") {
            player = hoverAudio1
            currentPlayer = "b"
        } else {
            player = hoverAudio2
            currentPlayer = "a"
        }

        player.play()

        setTimeout(loop, 2575)
    }

    loop()
}

function twistClockWise() {
    rotate += 30
    gsap.to(".dots", {
        rotate,
    })
    alienIdx = (alienIdx + 1) % ALIENS.length
    twist()
}

function twistCounterClockWise() {
    rotate -= 30
    gsap.to(".dots", {
        rotate,
    })
    alienIdx = (alienIdx - 1 + ALIENS.length) % ALIENS.length
    twist()
}

function videoTransitionOut() {
    if (video.duration - video.currentTime <= 1) {
        transformAudio.play()
        video.removeEventListener("timeupdate", videoTransitionOut)
        gsap.to(".overlay", {
            opacity: 1,
            duration: 0.4,
            delay: 0.5,
        })
        heroBG.src = YT_VIDEOS[alien as keyof typeof YT_VIDEOS]
    }
}

function blinkRed(n: number, duration: number) {
    const tl = gsap.timeline()
    const freq = duration / (2 * n)

    for (let i = 0; i < 2 * n; i++) {
        tl.to(
            {},
            {
                duration: freq / 1000,
                onStart: () => {
                    setWatchColor(i % 2 === 0 ? "red" : "white")
                },
            }
        )
    }

    return tl
}

function setWatchColor(color: string) {
    watchFace.dataset.color = color
    dots.forEach((dot) => {
        dot.dataset.color = color
    })
    btnTop.dataset.color = color
}

function activateBtnDown() {
    gsap.to(".activate-btn > .top", {
        y: -10,
        duration: 0.15,
    })
}

function activateBtnUp() {
    gsap.to(".activate-btn > .top", {
        y: 0,
        duration: 0.15,
    })
    activate()
}

function activateBtnPress() {
    gsap.timeline()
        .to(".activate-btn > .top", {
            y: -10,
            duration: 0.15,
        })
        .to(".activate-btn > .top", {
            y: 0,
            duration: 0.15,
        })
    activate()
}

function twist() {
    alien = ALIENS[alienIdx]
    alienImage.src = ALIEN_IMAGES[alien as keyof typeof ALIEN_IMAGES]
    twistSound.src =
        SOUNDS[`twist${(++soundIdx % 6) + 1}` as keyof typeof SOUNDS]
    twistSound.play()
}
