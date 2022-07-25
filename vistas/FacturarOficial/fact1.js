function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let curso = document.getElementById('curso').value;
        let nombres = document.getElementById('nombre').value;
        let apellidos = document.getElementById('apellido').value;
        let email = document.getElementById('email').value;
        let direccion = document.getElementById('direccion').value;
        let telefono = document.getElementById('telefono').value;
        let carne = document.querySelector('input[name="carne"]:checked').value;
        let CARNES = document.getElementById('CARNES').value;
        let lacteos = document.querySelector('input[name="lacteos"]:checked').value;
        let LACTEOS = document.getElementById('LACTEOS').value;
        let harinas = document.querySelector('input[name="harinas"]:checked').value;
        let HARINAS = document.getElementById('HARINAS').value;
        let miscelaneos = document.querySelector('input[name="miscelaneos"]:checked').value;
        let MISCELANEOS = document.getElementById('MISCELANEOS').value;
    
        generatePDF(curso, nombres, apellidos, email, direccion, telefono, lacteos, LACTEOS, carne, CARNES, harinas, HARINAS, miscelaneos, MISCELANEOS);
    })

});

async function generatePDF(curso, nombres, apellidos, email, direccion, telefono, lacteos, LACTEOS, carne, CARNES, harinas, HARINAS, miscelaneos, MISCELANEOS) {
    const image = await loadImage("formulario.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('p', 'pt', 'letter');

    pdf.addImage(image, 'PNG', 0, 0, 565, 792);
    pdf.addImage(signatureImage, 'PNG', 200, 605, 300, 60);

    pdf.setFontSize(12);
    pdf.text(curso, 260, 125);

    const date = new Date();
    pdf.text(date.getUTCDate().toString(), 235, 150);
    pdf.text((date.getUTCMonth() + 1).toString(), 275, 150);
    pdf.text(date.getUTCFullYear().toString(), 320, 150);

    pdf.setFontSize(10);
    pdf.text(nombres, 170, 213);
    pdf.text(apellidos, 170, 200);
    pdf.text(direccion, 170, 400);
    pdf.text(telefono, 170, 456);
    pdf.text(email, 170, 475);

    pdf.setFillColor(0,0,0);

    if (parseInt(carne) === 0) {
        pdf.circle(255, 374, 4, 'FD');
    } else {
        pdf.circle(190, 374, 4, 'FD');
        pdf.text(CARNES.toString(), 355, 378);
    }

    if (parseInt(lacteos) === 0) {
        pdf.circle(255, 374, 4, 'FD');
    } else {
        pdf.circle(190, 354, 4, 'FD');
        pdf.text(LACTEOS.toString(), 350, 359);
    }

    if (parseInt(harinas) === 0) {
        pdf.circle(255, 374, 4, 'FD');
    } else {
        pdf.circle(190, 334, 4, 'FD');
        pdf.text(HARINAS.toString(), 350, 345);
    }

    if (parseInt(miscelaneos) === 0) {
        pdf.circle(255, 374, 4, 'FD');
    } else {
        pdf.circle(190, 314, 4, 'FD');
        pdf.text(MISCELANEOS.toString(), 350, 322);
    }

    pdf.save("example.pdf");

}

/* ASI SOLO APARECE EL PUNTO NEGRO
   if (parseInt(lacteos) === 0) {
        pdf.circle(255, 374, 4, 'FD');
    } else {
        pdf.circle(180, 354, 4, 'FD');
        pdf.text(LACTEOS.toString(), 350, 488);
    }
*/