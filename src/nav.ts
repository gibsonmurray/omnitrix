import gsap from "gsap"

const tooltipDOM: HTMLElement = document.querySelector(".tooltip")!
const tooltipTextDOM: HTMLElement = document.querySelector(".tooltip-text")!
const tooltipArrowDOM: HTMLElement = document.querySelector(".tooltip-arrow")!
const tooltipBoxDOM: HTMLElement = document.querySelector(".tooltip-box")!

const navIcons: NodeListOf<HTMLElement> = document.querySelectorAll(".icon")
let isMouseOverIconOrTooltip = false

navIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
        isMouseOverIconOrTooltip = true
        tooltipMouseOver(icon)
    })
    icon.addEventListener("mouseleave", () => {
        isMouseOverIconOrTooltip = false
        setTimeout(() => {
            if (!isMouseOverIconOrTooltip) {
                tooltipMouseOut()
            }
        }, 200)
    })
})

tooltipDOM.addEventListener("mouseenter", () => {
    isMouseOverIconOrTooltip = true
})

tooltipDOM.addEventListener("mouseleave", () => {
    isMouseOverIconOrTooltip = false
    tooltipMouseOut()
})

async function tooltipMouseOver(icon: HTMLElement) {
    if (icon?.dataset.tooltip === "settings") {
        tooltipArrowDOM.style.transform = "translateX(35px)"
        tooltipBoxDOM.style.transform = "translateX(35px)"
        tooltipTextDOM.innerHTML = text.settings
    } else if (icon?.dataset.tooltip === "info") {
        tooltipArrowDOM.style.transform = "translateX(85px)"
        tooltipBoxDOM.style.transform = "translateX(85px)"
        tooltipTextDOM.innerHTML = text.info
    } else if (icon?.dataset.tooltip === "help") {
        tooltipArrowDOM.style.transform = "translateX(135px)"
        tooltipBoxDOM.style.transform = "translateX(135px)"
        tooltipTextDOM.innerHTML = text.help
    }
    gsap.to(".tooltip", {
        opacity: 1,
    })
}

function tooltipMouseOut() {
    gsap.to(".tooltip", {
        opacity: 0,
    })
}

const text = {
    help: `<span class="text help-text">
            <h3>Controls</h3>
            <hr />
            <h5>Activate</h5>
            <p>
                <span class="code">SPACE</span>
                <span class="code">UP-ARROW</span>
                <span class="code">MOUSE CLICK</span>
            </p>
            <h5>Twist</h5>
            <p>
                <span class="code">LEFT-ARROW</span>
                <span class="code">RIGHT-ARROW</span>
                <span class="code">SCROLL</span>
            </p>
            <h5>Go Hero</h5>
            <p>
                <span class="code">ENTER</span>
                <span class="code">DOWN-ARROW</span>
                <span class="code">MOUSE CLICK</span>
            </p>
        </span>`,
    info: `<span class="text info-text">
            <h3>About</h3>
            <hr />
            <p>This is a side-project developed by 
                <span class="code">Gibson Murray</span>
            </p>
            </span>
            <img
                class="prof-pic"
                src="./images/prof-pic.webp"
                alt="Gibson Profile Image"
            />
            
            <a class="portfolio-link" href="https://bento.me/gibsonmurray" target="_blank">
                <h5>PORTFOLIO</h5>
            </a>`,
    settings: `coming soon...`,
}
