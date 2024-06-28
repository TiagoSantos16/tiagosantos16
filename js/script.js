document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Mensagem enviada com sucesso!');
});

document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("nav ul li a");

    // Adiciona evento de clique para os links do menu
    for (const link of links) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            targetElement.scrollIntoView({
                behavior: "smooth"
            });

            // Chama a função para alternar o idioma ao rolar até a seção
            toggleLanguageForSection(targetId);
        });
    }

    
    const ptBtn = document.getElementById("pt-btn");
    const enBtn = document.getElementById("en-btn");

    ptBtn.addEventListener("click", function() {
        toggleLanguage("pt");
    });

    enBtn.addEventListener("click", function() {
        toggleLanguage("en");
    });

    function toggleLanguage(language) {
        const elements = document.querySelectorAll("[class*='pt'], [class*='en']");
        elements.forEach(element => {
            element.classList.remove("active");
            if (element.classList.contains(language)) {
                element.classList.add("active");
            }
        });

        ptBtn.classList.toggle("active", language === "pt");
        enBtn.classList.toggle("active", language === "en");
    }

});

