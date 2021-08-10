let ventas=[];
let alicuotas=[];
let nombreArchivoVentas;
let nombreArchivoAlicuotas;
let selectedFile;
// document.getElementById('input').addEventListener("change", e =>{
//     selectedFile= e.target.files[0];
// });

document.getElementById('input').addEventListener("change", e =>{
    selectedFile= e.target.files[0];
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            let data = e.target.result;

            let workbook = XLSX.read(data, {
                type: "binary"
        });
        workbook.SheetNames.forEach(sheet => {
            let datos  = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
     
            let archivoVentas = `${new Date((datos[0].fecha - (25567+2)) * 86400 * 1000).getUTCMonth() + 1} - ${new Date((datos[0].fecha - (25567+2)) * 86400 * 1000).getUTCFullYear()}Ventas.txt`;
            nombreArchivoVentas = archivoVentas;
            let archivosAlicuotas  = `${new Date((datos[0].fecha - (25567+2)) * 86400 * 1000).getUTCMonth() + 1} - ${new Date((datos[0].fecha - (25567+2)) * 86400 * 1000).getUTCFullYear()}AlicuotasVentas.txt`;
            nombreArchivoAlicuotas = archivosAlicuotas;


            for (let i = 0; i < datos.length; i++) {
            let anio = new Date((datos[i].fecha - (25567+2)) * 86400 * 1000).getUTCFullYear(); //De la fecha sacamos el anio
            let mes = new Date((datos[i].fecha - (25567+2)) * 86400 * 1000).getUTCMonth() + 1 //De la fecha sacamos el mes
            let dia = new Date((datos[i].fecha - (25567+2)) * 86400 * 1000).getUTCDate(); //De la fecha sacamos el dia
                
            let cod_Comprobante = datos[i].cod_comp; //Sacamos el atributo cod_comp
            let tipo_Comp = tipoDeComprobrante(datos[i].cod_comp); //Llamamos a la funcion tipo de Comprobante pasandole cod_Comp para que nos devuelva un numero
            let comprobante = datos[i].comprob; //Nos da el numero de comprobante
            let cod_Documento = datos[i].cod_doc;
            let numero_Cuit = datos[i].nro_cuit;
            let idCliente = datos[i].cliente
            let importeTotal = 000000000000000 + datos[i].total;
            let cantidadAlicuotas = datos[i].cant_iva;
            let gravado21 = datos[i].gravado21;
            let gravado105 = datos[i].gravado105;
            let iva21 = datos[i].iva21;
            let iva105 = datos[i].iva105;


            dia=verificarDia(dia);  

            mes=verificarMes(mes);

            cod_Comprobante=verficarCodComprobante(cod_Comprobante);

            comprobante = "00000000000000" + comprobante;

            numero_Cuit =  numero_Cuit.toString().padStart(20,0);

            importeTotal = (importeTotal*=100).toFixed(0); //Va toFixed o Mathround
            importeTotal=importeTotal.toString().padStart(15,0);//convertimos a string y autocompleta con 0

            gravado21= Math.round(gravado21*100);
            gravado21=gravado21.toString().padStart(15,0);

            gravado105=Math.round(gravado105*100);
            gravado105=gravado105.toString().padStart(15,0);

            iva21 =Math.round( iva21*100);
            iva21=iva21.toString().padStart(15,0);

            iva105 =Math.round( iva105*100); 
            iva105=iva105.toString().padStart(15,0);

            //Acortamos o alaragamos un nombre segun la cantidad de la cadena
            idCliente=verificarNombreCadena(idCliente);


            let a = anio.toString() + mes.toString() + dia.toString() + cod_Comprobante + tipo_Comp + comprobante + comprobante + cod_Documento  + numero_Cuit + idCliente + importeTotal.toString() + "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000PES0001000000" + cantidadAlicuotas + "000000000000000000000000";
            
            let b21 = cod_Comprobante + tipo_Comp + comprobante + gravado21 + "0005" + iva21 ;
            
            let b105 = cod_Comprobante + tipo_Comp + comprobante + gravado105 + "0004" + iva105 ;
            
        if(gravado21 !== "000000000000000"){
            alicuotas.push(`${b21}\n`)
            
            }

            if(gravado105 !== "000000000000000"){

            alicuotas.push(`${b105}\n`)
            
            }
            
            ventas.push(`${a}\n`);

            
            }
            function tipoDeComprobrante(cadena) {
            
            if(cadena == 82 || cadena === 81 || cadena === 113 || cadena === 112 || cadena === 115 || cadena === 116){
                return  "00003";
            }else{
                return "00004";
            }
            }


            //si el dia es menor a 10 le agregamos un 0
            function verificarDia(dia) {
            if(dia<10){
                dia="0"+dia.toString();
            }
            return dia;
            }

            //si el mes es menor a 10 le agregamos un 0
            function verificarMes(mes) {
            if(mes<10){
                mes="0"+mes.toString();
            }
            return mes;
            }


            function verficarCodComprobante(cod_Comprobante) {
            if(cod_Comprobante<10){
                cod_Comprobante = "00" + cod_Comprobante;
            }else if(cod_Comprobante<100){
                cod_Comprobante = "0" + cod_Comprobante;
            }


            return cod_Comprobante;
            }


            //Acortamos o alaragamos un nombre segun la cantidad de la cadena
            function verificarNombreCadena(idCliente) {
            if(idCliente.length<=30){
                
                idCliente = idCliente.padEnd(30," ");
            
            }else{

                idCliente = idCliente.substr(0,30);
            
            }

            return idCliente;
            }


        });
        };
        fileReader.readAsBinaryString(selectedFile);
    }
})

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

//Genera un objeto Blob con los datos en un archivo TXT
function generarTexto(datos) {
    return new Blob(datos, { type: 'text/plain'});
};


document.getElementById('boton-txt').addEventListener('click', function () {
    descargarArchivo(generarTexto(ventas), nombreArchivoVentas);
}, false);

document.getElementById('boton-Alicuotas-txt').addEventListener('click', function () {
    descargarArchivo(generarTexto(alicuotas), nombreArchivoAlicuotas);
}, false);