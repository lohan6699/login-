// Inside the Green Ninja click event:
ninjaGreen.style.zIndex = "10";
ninjaRed.style.zIndex = "1";

// Inside the Red Ninja click event:
ninjaRed.style.zIndex = "10";
ninjaGreen.style.zIndex = "1";
// Example for Green attacking Red:
ninjaRed.classList.add('hit');
setTimeout(() => {
    ninjaRed.classList.remove('hit');
}, 500);