function addVideoToGallery(videoSrc, title) {
    /*
    * This should add an element to "main" which contains the videos
    * The element should be :
    * <div class="video">
            <video controls>
                <source src="video1.mp4" type="video/mp4">
            </video>
            <h2>Video 1</h2>
      </div>
    * */

    // Create the video element
    let videoElement = document.createElement("video");
    videoElement.controls = true;
    let sourceElement = document.createElement("source");
    sourceElement.src = videoSrc;
    sourceElement.type = "video/mp4";
    videoElement.appendChild(sourceElement);

    // Create the h2 element
    let h2Element = document.createElement("h2");

    // Create the div element
    let divElement = document.createElement("div");
    divElement.className = "video";
    divElement.appendChild(videoElement);
    divElement.appendChild(h2Element);

    // Add the div element to the main element
    let mainElement = document.querySelector("main");
    mainElement.appendChild(divElement);

    // Add the video title
    h2Element.textContent = title;
}

const nbOfVideos = 27;

const titles = ["50 degrés", "Je j'arrive : la musique", "Les chauves",
                        "Quand on lâche une pomme", "Paulochon", "Télékinésie",
                        "Bonne semaine", "Pc turbo", "Le chemin de la science",
                        "Jsp frr", "Exposé", "Rêve tah gros",
                        "Google créer sans utiliser Google", "Ambiance dubai", "Pr.Laurent Outang",
                        "Pk les chiens nous lèchent le visage", "Beuh", "Repas tah succulent",
                        "Webinaire néerlandais", "Dispositits pour ouvrir une porte", "Sandale",
                        "Vin rouge geusgé", "Domaine monfutal", "Wiskas",
                        "Caprice des queues", "Tu est pauvre", "Je j'arrive : le rêve"];

function addAllVideosToGallery() {
    // Every video is named v1.mp4, v2.mp4, v3.mp4, etc.
    // And are located in the folder "video"
    for (let i = 1; i <= nbOfVideos; i++) {
        // Add the video with the title, will be video i if title is not provided
        let title = i <= titles.length ? titles[i - 1] : `Video ${i}`;
        addVideoToGallery(`video/v${i}.mp4`, title);
    }
}

addAllVideosToGallery();