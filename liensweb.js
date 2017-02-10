/* 
Activité 3
*/

// Liste des liens Web à afficher. Un lien est défini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publié)
var listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    },
    {
        titre: "L'encyclopédie en ligne Wikipedia",
        url: "http://Wikipedia.org",
        auteur: "annie.zette"
    }
];

function creerElementLien(lien) {
    var titreLien = document.createElement("a");
    titreLien.href = lien.url;
    titreLien.style.color = "#428bca";
    titreLien.style.textDecoration = "none";
    titreLien.style.marginRight = "5px";
    titreLien.appendChild(document.createTextNode(lien.titre));

    var urlLien = document.createElement("span");
    urlLien.appendChild(document.createTextNode(lien.url));

    // Cette ligne contient le titre et l'URL du lien
    var ligneTitre = document.createElement("h4");
    ligneTitre.style.margin = "0px";
    ligneTitre.appendChild(titreLien);
    ligneTitre.appendChild(urlLien);

    // Cette ligne contient l'auteur
    var ligneDetails = document.createElement("span");
    ligneDetails.appendChild(document.createTextNode("Ajouté par " + lien.auteur));

    var divLien = document.createElement("div");
    divLien.classList.add("lien");
    divLien.appendChild(ligneTitre);
    divLien.appendChild(ligneDetails);

    return divLien;
}

// Crée et renvoie un élément DOM de type input
function creerElementInput(placeholder, taille) {
    var inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.setAttribute("size", taille);
    inputElt.setAttribute("required", "true");
    inputElt.padding = "5px";
    return inputElt;
}

var contenu = document.getElementById("contenu");

// creation d'un paragraphe pour bouton/formulaire et message info
var p = document.createElement("p");
contenu.appendChild(p);
var ajouterLienElt = document.createElement("input");
ajouterLienElt.type = "button";
ajouterLienElt.value = "Ajouter un lien";
p.appendChild(ajouterLienElt);

// 2eme paragraphe pour la liste des liens
var p2 = document.createElement("p");
p2.setAttribute("id","p2");
contenu.appendChild(p2);

// Parcours de la liste des liens et ajout d'un élément au DOM pour chaque lien
/*listeLiens.forEach(function (lien) {
    var elementLien = creerElementLien(lien);
    p2.appendChild(elementLien);
});*/

ajaxGet(" https://oc-jswebsrv.herokuapp.com/api/liens", function (lien) {
    // Parcours de la liste des liens et ajout d'un élément au DOM pour chaque lien
    var listeLiens= JSON.parse(lien);
    listeLiens.forEach(function (lien) {
        var lienElt = creerElementLien(lien);
        p2.appendChild(lienElt);
    });
});

// gestion du clic de Ajouter un lien
ajouterLienElt.addEventListener("click", function () {
    // Creation du formulaire
    var auteurElt = creerElementInput("Entrez votre nom", 20);
    var titreElt = creerElementInput("Entrez le titre du lien", 40);
    var urlElt = creerElementInput("Entrez l'URL du lien", 40);
    var ajoutElt = document.createElement("input");
    ajoutElt.type = "submit";
    ajoutElt.value = "Ajouter";
    var formAjoutElt = document.createElement("form");
    formAjoutElt.appendChild(auteurElt);
    formAjoutElt.appendChild(titreElt);
    formAjoutElt.appendChild(urlElt);
    formAjoutElt.appendChild(ajoutElt);
    // replacer le bouton par le formulaire
    p.replaceChild(formAjoutElt, ajouterLienElt);
    
    // gestion du clic ajouter
    formAjoutElt.addEventListener("submit", function (e) {
        e.preventDefault();
        var url = urlElt.value;
        // Si l'URL ne commence ni par "http://" ni par "https://"
        if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
            // On la préfixe par "http://"
            url = "http://" + url;
        }
 
        // Création de l'objet contenant les données du nouveau lien
        var lien = {
            titre: titreElt.value,
            url: url,
            auteur: auteurElt.value
        };
        
        ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", lien, function () {
            var lienElt = creerElementLien(lien);       
            // Ajoute le nouveau lien en haut de la liste
            p2.insertBefore(lienElt, p2.firstChild);  
            // Création du message d'information
            var infoElt = document.createElement("div");
            infoElt.style.backgroundColor = "#428bca";
            infoElt.style.padding = "10px";
            infoElt.style.marginBottom = "10px";
            infoElt.textContent = "Le lien \"" + lien.titre + "\" a bien été ajouté.";
            contenu.insertBefore(infoElt, contenu.firstChild);
            // Suppresion du message après 2 secondes
            setTimeout(function () {
                contenu.removeChild(infoElt);
            }, 2000);
        }, true);
        p.replaceChild(ajouterLienElt, formAjoutElt);
    });
});