// helpers/pdfExtractorServer.js
// Version del extractor para uso en backend (CommonJS)
function extraerDatosLicencia(textoRaw) {
  let texto = (textoRaw || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ ]*\n[ ]*/g, '\n');

  texto = texto
    .replace(/N[º°o]\s*de\s*d[ií]as/gi, 'N° de días')
    .replace(/Fecha\s*de?\s*T[eé]rmino/gi, 'Fecha Termino')
    .replace(/Direcci[oó]n\s+(?:de?\s*)?Reposo/gi, 'Dirección Reposo')
    .replace(/Tipo\s+de\s+licencia/gi, 'Tipo de licencia')
    .replace(/Inicio\s*de\s*Reposo/gi, 'Inicio de Reposo')
    .replace(/Sex[oó]/gi, 'Sexo')
    .replace(/Ed[aá]d/gi, 'Edad');

  const firstMatch = (txt, patterns) => {
    for (const re of patterns) {
      const m = txt.match(re);
      if (m && m[1]) return m[1].trim().replace(/\s+/g, ' ');
    }
    return 'No encontrado';
  };
  const block = (re) => (texto.match(re)?.[1] || texto);

  const datosPersonales = block(/1\.\s*Identificaci[oó]n del Trabajador([\s\S]*?)2\.\s*Identificaci[oó]n del Hijo/i);
  const datosReposo     = block(/3\.\s*Datos de reposo([\s\S]*?)4\.\s*Datos del Prestador/i);
  const datosPrestador  = block(/4\.\s*Datos del Prestador([\s\S]*)$/i);

  const reFolio = [ /Folio(?:\s+Licencia)?\s*:*\s*([0-9]+-[0-9Kk])/i ];
  const reNombre = [ /Nombre\s*:*\s*([^\n\r]+?)(?=\s+(?:RUT|RUN|Edad|Sexo|Fecha\s+de\s+Emisi[oó]n|Inicio\s+de\s+Reposo|Tipo\s+de\s+licencia|N°\s+de\s+d[ií]as)\b|$)/i ];
  const reRUT = [ /RUT\s*:*\s*((?:\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[\dkK])/i, /RUN\s*:*\s*((?:\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[\dkK])/i ];
  const reEdad = [ /Edad\s*:*\s*(\d{1,3})\b/i ];
  const reSexo = [ /Sexo\s*:*\s*(Masculino|Femenino|MASCULINO|FEMENINO)\b/i ];
  const reFechaEmision = [ /Fecha\s+de\s+Emisi[oó]n\s*:*\s*(\d{2}[-/]\d{2}[-/]\d{4})/i ];
  const reInicioReposo = [ /Inicio\s+de\s+Reposo\s*:*\s*(\d{2}[-/]\d{2}[-/]\d{4})/i ];
  const reFechaTermino = [ /Fecha\s+Termino\s*:*\s*(\d{2}[-/]\d{2}[-/]\d{4})/i ];
  const reDias = [ /N°\s+de\s+d[ií]as\s*:*\s*(\d{1,3})\b/i ];

  const reTipoLicencia = [ /Tipo\s+de\s+licencia\s*:*\s*([^\n\r]+?)(?=\s+(?:\d+\.)|\s+Fecha|\s+Inicio|\s+N°|\s+Direcci[oó]n|\s+Tel[eé]fono|\s+Profesional|$)/i ];

  const reProfesionalPrefer = [ /Profesional\s*:*\s*(?!que lo emite\b)([^\n\r]+?)(?=\s*(?:Entidad\b|Raz[oó]n\s+Social\b|Operador\b|Folio\b|Estado\b|Fecha\b|Tel[eé]fono\b|Direcci[oó]n\b|1\.\s*Identificaci[oó]n|2\.\s*Identificaci[oó]n|3\.\s*Datos|4\.\s*Datos|Tipo\s+de\s+licencia\b|N°\s+de\s+d[ií]as\b|$))/i ];
  const reProfesionalFallback = [ /Profesional\s*:*\s*(?!que lo emite\b)([^\n\r]+?)(?=\s*(?:Entidad\b|Raz[oó]n\s+Social\b|Operador\b|Folio\b|Estado\b|Fecha\b|Tel[eé]fono\b|Direcci[oó]n\b|1\.\s*Identificaci[oó]n|2\.\s*Identificaci[oó]n|3\.\s*Datos|4\.\s*Datos|Tipo\s+de\s+licencia\b|N°\s+de\s+d[ií]as\b|$))/i ];
  const reDireccion = [ /Direcci[oó]n\s+Reposo\s*:*\s*([^\n\r]+?)(?=\s+Tel[eé]fono\b|$)/i ];
  const reTelefono = [ /Tel[eé]fono\s*:*\s*((?:\+?56)?\s*(?:\(?0?\d{1,2}\)?)?\s*\d{7,9}(?:\s*\d{2,3})?)/i ];

  const reDiagnostico = [
    /Diagn[oó]stico\s*:?\s*([^\n\r]+?)(?=\s*(?:Profesional|Fecha|Inicio|N°|Direcci[oó]n|Tel[eé]fono|1\.|2\.|3\.|4\.|$))/i,
    /Diagn[oó]stico\s*:?\s*([\s\S]*?)(?=\n\s*(?:Profesional|Fecha|Inicio|N°|Direcci[oó]n|Tel[eé]fono|1\.|2\.|3\.|4\.|$))/i,
    /Diagn[oó]stico(?:\s+cl[ií]nico)?\s*:?\s*([\s\S]{2,200}?)(?=\n|$)/i
  ];

  let profesional = firstMatch(datosPrestador, reProfesionalPrefer);
  if (
    profesional === 'No encontrado' ||
    /^que lo emite\b/i.test(profesional) ||
    profesional.length < 5
  ) {
    const reGlobal = new RegExp(reProfesionalFallback[0].source, 'ig');
    let m, ultimo = null;
    while ((m = reGlobal.exec(texto)) !== null) {
      if (m[1] && !/^que lo emite\b/i.test(m[1])) ultimo = m[1];
    }
    profesional = ultimo ? ultimo.trim().replace(/\s+/g, ' ') : 'No encontrado';
  }

  const datos = {
    folio:        firstMatch(texto,           reFolio),
    nombre:       firstMatch(datosPersonales, reNombre),
    rut:          firstMatch(datosPersonales, reRUT),
    edad:         firstMatch(datosPersonales, reEdad),
    sexo:         firstMatch(datosPersonales, reSexo),
    fechaEmision: firstMatch(datosPersonales, reFechaEmision),
    inicioReposo: firstMatch(datosPersonales, reInicioReposo),
    fechaTermino: firstMatch(datosReposo,     reFechaTermino),
    dias:         firstMatch(datosPersonales, reDias),
    tipoLicencia: firstMatch(datosPersonales, reTipoLicencia),
    profesional:  profesional,
    direccion:    firstMatch(datosReposo,     reDireccion),
    telefono:     firstMatch(datosReposo,     reTelefono),
    diagnostico:  (() => {
      const candidates = [
        firstMatch(datosReposo, reDiagnostico),
        firstMatch(datosPersonales, reDiagnostico),
        firstMatch(datosPrestador, reDiagnostico),
        firstMatch(texto, reDiagnostico)
      ];
      for (const c of candidates) {
        if (c && c !== 'No encontrado') return c;
      }
      return 'No encontrado';
    })()
  };

  if (datos.direccion !== 'No encontrado') {
    datos.direccion = datos.direccion
      .replace(/\bReposo:\s*/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  if (/^masculino$/i.test(datos.sexo)) datos.sexo = 'Masculino';
  if (/^femenino$/i.test(datos.sexo))  datos.sexo = 'Femenino';

  const normFecha = (f) => f && f !== 'No encontrado' ? f.replace(/\//g, '-') : f;
  datos.fechaEmision = normFecha(datos.fechaEmision);
  datos.inicioReposo = normFecha(datos.inicioReposo);
  datos.fechaTermino = normFecha(datos.fechaTermino);

  return datos;
}

module.exports = { extraerDatosLicencia };
