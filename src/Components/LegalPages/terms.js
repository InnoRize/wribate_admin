let expandedSections = {
    1: true // First section expanded by default
};

function toggleSection(sectionId) {
    expandedSections[sectionId] = !expandedSections[sectionId];
    updateSectionVisibility(sectionId);
}

function updateSectionVisibility(sectionId) {
    const contentDiv = document.getElementById("content-"+sectionId);
    const iconSvg = document.getElementById("icon-"+sectionId);
    
    if (expandedSections[sectionId]) {
        contentDiv.style.display = 'block';
        iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>';
    } else {
        contentDiv.style.display = 'none';
        iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>';
    }
}

// Initialize all sections except first as collapsed
document.querySelectorAll('[id^="content-"]').forEach(el => {
    const id = el.id.split('-')[1];
    if (id !== '1' && !expandedSections[id]) {
        el.style.display = 'none';
    }
});