// api/sendMails.js

import nodemailer from 'nodemailer';
import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { useDispatch } from "react-redux";


const API_VERSION3 = "/api/v3";
const BASE_URL = "https://femsa-api.vercel.app";
const TOKEN = `Bearer FeMsA@2024`;
import moment from 'moment';

const sendIt = async (title, destiny, days) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "email-smtp.us-east-1.amazonaws.com",
            port: "587",
            auth: {
                user: "AKIAWTE57ZETFQ6CVKGI",
                pass: "BCVJVEtchcpMirwH8Sp5UrrZZoUtHB7seWPTlIijRX/+",
            },
            secureConnection: false,
            tls: {
                rejectUnauthorized: true,
                minVersion: "TLSv1.2"
            },
        });

        let to = destiny
        let subject = `Recordatorio de Actualizacion ${title}`
        let text = ''
        let html = `

<Html lang="es">
<head>
<meta charset="utf-8"> <!-- utf-8 works for most cases -->
<meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
<meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
<title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">

<style>

    html,
body {
margin: 0 auto !important;
padding: 0 !important;
height: 100% !important;
width: 100% !important;
background: #f1f1f1;
}


* {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}



table {
border-spacing: 0 !important;
border-collapse: collapse !important;
table-layout: fixed !important;
margin: 0 auto !important;
}


img {
-ms-interpolation-mode:bicubic;
}

a {
text-decoration: none;
}

*[x-apple-data-detectors],  
.unstyle-auto-detected-links *,
.aBn {
border-bottom: 0 !important;
cursor: default !important;
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important;
}

.a6S {
display: none !important;
opacity: 0.01 !important;
}

.im {
color: inherit !important;
}

img.g-img + div {
display: none !important;
}


@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
u ~ div .email-container {
    min-width: 320px !important;
}
}
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
u ~ div .email-container {
    min-width: 375px !important;
}
}
@media only screen and (min-device-width: 414px) {
u ~ div .email-container {
    min-width: 414px !important;
}
}

</style>

<style>

    .primary{
background: #30e3ca;
}
.bg_white{
background: #ffffff;
}
.bg_light{
background: #fafafa;
}
.bg_black{
background: #000000;
}
.bg_dark{
background: rgba(0,0,0,.8);
}
.email-section{
padding:2.5em;
}

.btn{
padding: 10px 15px;
display: inline-block;
}
.btn.btn-primary{
border-radius: 5px;
background: #fe0019c9;
color: #ffffff;
}
.btn.btn-white{
border-radius: 5px;
background: #ffffff;
color: #000000;
}
.btn.btn-white-outline{
border-radius: 5px;
background: transparent;
border: 1px solid #fff;
color: #fff;
}
.btn.btn-black-outline{
border-radius: 0px;
background: transparent;
border: 2px solid #000;
color: #000;
font-weight: 700;
}

h1,h2,h3,h4,h5,h6{
font-family: 'Lato', sans-serif;
color: #000000;
margin-top: 0;
font-weight: 400;
}

body{
font-family: 'Lato', sans-serif;
font-weight: 400;
font-size: 15px;
line-height: 1.8;
color: rgba(0,0,0,.4);
}

a{
color: #30e3ca;
}



.logo h1{
margin: 0;
}
.logo h1 a{
color: #30e3ca;
font-size: 24px;
font-weight: 700;
font-family: 'Lato', sans-serif;
}

.hero{
position: relative;
z-index: 0;
}

.hero .text{
color: rgba(0,0,0,.3);
}
.hero .text h2{
color: #000;
font-size: 40px;
margin-bottom: 0;
font-weight: 400;
line-height: 1.4;
}
.hero .text h3{
font-size: 24px;
font-weight: 300;
}
.hero .text h2 span{
font-weight: 600;
color: #30e3ca;
}



.heading-section h2{
color: #000000;
font-size: 28px;
margin-top: 0;
line-height: 1.4;
font-weight: 400;
}
.heading-section .subheading{
margin-bottom: 20px !important;
display: inline-block;
font-size: 13px;
text-transform: uppercase;
letter-spacing: 2px;
color: rgba(0,0,0,.4);
position: relative;
}
.heading-section .subheading::after{
position: absolute;
left: 0;
right: 0;
bottom: -10px;
content: '';
width: 100%;
height: 2px;
background: #30e3ca;
margin: 0 auto;
}

.heading-section-white{
color: rgba(255,255,255,.8);
}
.heading-section-white h2{
line-height: 1;
padding-bottom: 0;
}
.heading-section-white h2{
color: #ffffff;
}
.heading-section-white .subheading{
margin-bottom: 0;
display: inline-block;
font-size: 13px;
text-transform: uppercase;
letter-spacing: 2px;
color: rgba(255,255,255,.4);
}

</style>
</head>

<body width="100%" style="margin: 0; padding: 0 !important; background-color: #f1f1f1;">
<center style="width: 100%; background-color: #f1f1f1;">
<div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; font-family: sans-serif;">
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>
<div style="max-width: 600px; margin: 0 auto;" class="email-container">
    <!-- BEGIN BODY -->
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">

  <tr>
      <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;">
                    <div class="text" style="padding: 0 2.5em; text-align: center;">
                        <h3>Recordatorio de actualizacion</h3>
                        <h5>Este correo automatico es para informar que han pasado mas de ${days} dias sin nuevas cargas de archivos, necesarios para mantener la plataforma actualizada.</h5>
                        <p><a href="https://bo.femsa.ar/uploads" class="btn btn-primary">Subir Archivos</a></p>
                        <h6> Equipo de soporte.</h6>
                    </div>
      </td>
      </tr>
  </table>
</div>
</center>
</body>
</Html>`


        let info = await transporter.sendMail({
            from: `Femsa BackOffice <sistemas@femsa.ar>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });
        console.log("Message senntttttttttt correct");


        //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.log('error', err);
    }
}

const sendMails = async () => {
    const fechaHoy = new Date();
    //console.log('fechaHoy', fechaHoy)
    const response = await axios.get(BASE_URL + API_VERSION3 + "/back/process/uploaded_files", {
        headers: { Authorization: TOKEN },
    });
    const responseEmail = await axios.get(BASE_URL + API_VERSION3 + "/back/alerts/email", {
        headers: { Authorization: TOKEN },
    });
    const datosEmail = responseEmail.data;
    const datos = response.data;

    console.log('datos', datos)
    console.log('datosEmail', datosEmail)

    const ventaDirecta = datos.filter(obj => obj.type === "venta_directa");
    const ventaIndirecta = datos.filter(obj => obj.type === "venta_indirecta");
    const comercializadores = datos.filter(obj => obj.type === "comercializadores");
    const products = datos.filter(obj => obj.type === "products")
    const clientes = datos.filter(obj => obj.type === "clients")
    const premios = datos.filter(obj => obj.type === "prizes")


    const fechaDirecta = new Date(ventaDirecta[0]?.updated_at)
    const fechaIndirecta = new Date(ventaIndirecta[0]?.updated_at)
    const fechaComer = new Date(comercializadores[0]?.updated_at)
    const fechaProdu = new Date(products[0]?.updated_at)
    const fechaPremios = new Date(premios[0]?.updated_at)
    const fechaClientes = new Date(clientes[0]?.updated_at)


    const restaDirecta = Math.floor((fechaHoy - fechaDirecta) / (1000 * 60 * 60 * 24))
    const restaIndirecta = Math.floor((fechaHoy - fechaIndirecta) / (1000 * 60 * 60 * 24))
    const restaComer = Math.floor((fechaHoy - fechaComer) / (1000 * 60 * 60 * 24))
    const restaProdu = Math.floor((fechaHoy - fechaProdu) / (1000 * 60 * 60 * 24))
    const restaPremios = Math.floor((fechaHoy - fechaPremios) / (1000 * 60 * 60 * 24))
    const restaClientes = Math.floor((fechaHoy - fechaClientes) / (1000 * 60 * 60 * 24))


    datosEmail.map((item) => {
        console.log('item', item)
        if (item.purchases && restaDirecta >= 3 && restaDirecta % 3 === 0) {
            sendIt('Compras Directa', item.email, restaDirecta)
        }
        if (item.purchases && restaIndirecta >= 3 && restaIndirecta % 3 === 0) {
            sendIt('Compras Indirecta', item.email, restaIndirecta)
        }
        if (item.clients && restaClientes >= 4 && restaClientes % 4 === 0 && fechaClientes.getMonth() !== fechaHoy.getMonth()) {
            sendIt('Clientes', item.email, restaClientes)
        }
        if (item.products && restaProdu >= 4 && restaProdu % 4 === 0 && fechaProdu.getMonth() !== fechaHoy.getMonth()) {
            sendIt('Productos', item.email, restaProdu)
        }
        if (item.commercials && restaComer >= 4 && restaComer % 4 === 0 && fechaComer.getMonth() !== fechaHoy.getMonth()) {
            sendIt('Comercializadores', item.email, restaComer)
        }
        if (item.prizes && restaPremios >= 4 && restaPremios % 4 === 0 && fechaPremios.getMonth() !== fechaHoy.getMonth()) {
            sendIt('Premios', item.email, restaPremios)
        }
    })

};

module.exports = sendMails;