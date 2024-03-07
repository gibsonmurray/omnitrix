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
const imagesUrl = "./src/assets/images/"
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
const soundsUrl = "./src/assets/sounds/"
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
const videosUrl = "./src/assets/videos/"
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

/* ---*--- DOM GLOBALS ---*--- */

const activateBtn: HTMLButtonElement = document.querySelector(".activate-btn")!
const watchFace: HTMLElement = document.querySelector(".alien-select")!
const dots: NodeListOf<HTMLElement> = document.querySelectorAll(".dot")!
const btnTop: HTMLElement = document.querySelector(".activate-btn > .top")!
const video: HTMLVideoElement = document.querySelector(".transformation-video")!
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
    gsap.to(".activate-btn > .top", {
        y: -10,
        duration: 0.15,
    })
})

activateBtn.addEventListener("mouseup", () => {
    gsap.to(".activate-btn > .top", {
        y: 0,
        duration: 0.15,
    })
    activate()
})

window.addEventListener(
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
            alien = ALIENS[alienIdx]
            alienImage.src = ALIEN_IMAGES[alien as keyof typeof ALIEN_IMAGES]
            twistSound.src =
                SOUNDS[`twist${(++soundIdx % 6) + 1}` as keyof typeof SOUNDS]
            twistSound.play()

            accumulatedScroll = 0
        }
    },
    { passive: false }
)

watchFace.addEventListener("click", () => {
    if (active && recharged) goHero()
})

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
    video.play()

    // transition in
    gsap.to(".overlay", {
        opacity: 0,
        duration: 0.4,
        delay: 0.5,
    })

    // transition out
    video.addEventListener("timeupdate", videoTransitionOut)

    setWatchColor("white")

    video.onended = () => {
        gsap.timeline()
            .set(".transformation-video", {
                display: "none",
            })
            .to(".overlay", {
                opacity: 0,
                duration: 0.4,
            })
        timeout(3000)
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
            .call(() => {
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
            .call(() => {
                recharged = false
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
}

function twistCounterClockWise() {
    rotate -= 30
    gsap.to(".dots", {
        rotate,
    })
    alienIdx = (alienIdx - 1 + ALIENS.length) % ALIENS.length
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
