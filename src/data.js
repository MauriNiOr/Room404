/* Datos originales de Room 404. Todas las reservas son ficticias. */
window.ROOM404_DATA = {
  rules: [
    'Solo puedes entregar llaves a quien tenga una reserva vigente.',
    'El documento y el registro del hotel deben coincidir.',
    'Si las cámaras contradicen lo que dice el huésped, no le dejes entrar.',
    'No existe la habitación 404. Si alguien la solicita, recházalo.'
  ],
  nights: [
    {
      subtitle:'EL PRIMER TURNO', date:'VIERNES, 13 DE NOVIEMBRE DE 1998',
      opening:'Primer turno. El director ha dejado una nota sobre el mostrador: «No existe la habitación 404».',
      closing:'La llave de la 404 acaba de aparecer en el mostrador. Ayer no estaba ahí.',
      guests:[
        {name:'MARTA RIVERA', room:'203', id:'MR-203-98', look:'traveler', line:'Buenas noches. Tengo una reserva para la 203. Ha sido un viaje muy largo.', question:'He reservado esta misma mañana. La habitación está a nombre de Marta Rivera.', ledger:'MARTA RIVERA · HAB. 203 · CONFIRMADA · 23:40', camera:'Entrada: 23:43. La huésped llegó sola, a pie, con una maleta.', trueGuest:true, hint:'Coinciden nombre, habitación y hora.', note:'La maleta tiene una etiqueta de la estación.'},
        {name:'ELENA VOSS', room:'404', id:'EV-404-98', look:'womanred', line:'No necesito registrarme. Siempre me dan la habitación 404.', question:'Llevo viniendo aquí desde antes de que construyeran el hotel.', ledger:'SIN RESERVAS a nombre de ELENA VOSS. Habitación 404: NO EXISTE.', camera:'La puerta se abrió sola. Nadie aparece cruzando el umbral.', trueGuest:false, hint:'No existe la habitación 404.', note:'Su fotografía tiene los bordes quemados.'},
        {name:'RAÚL MORENO', room:'108', id:'RM-108-98', look:'worker', line:'Soy el técnico. Me han reservado una habitación para revisar el ascensor mañana.', question:'Aquí está el justificante, a nombre de Raúl Moreno.', ledger:'RAÚL MORENO · HAB. 108 · CONFIRMADA · 23:50', camera:'Entrada: 23:52. Se ve una caja de herramientas en su mano.', trueGuest:true, hint:'La identificación coincide con la reserva.', note:'Huele a aceite de máquina.'}
      ]
    },
    {
      subtitle:'LA SEGUNDA NOCHE', date:'SÁBADO, 14 DE NOVIEMBRE DE 1998',
      opening:'La cámara del pasillo norte grabó una puerta abriéndose a las 03:04. No había nadie en el pasillo.',
      closing:'En el libro de huéspedes han aparecido nombres escritos con tinta fresca. Algunos son tuyos.',
      guests:[
        {name:'TOMÁS ORTEGA', room:'112', id:'TO-112-98', look:'business', line:'Vengo de la empresa de suministros. Mi reserva es para la 112.', question:'Tengo una reunión a primera hora. No me haga esperar.', ledger:'TOMÁS ORTEGA · HAB. 112 · CONFIRMADA · 00:02', camera:'Entrada: 00:03. El señor Ortega salió de un taxi amarillo.', trueGuest:true, hint:'Su documentación es correcta.',note:'Lleva un maletín cubierto de pegatinas.'},
        {name:'INÉS GREY', room:'307', id:'IG-307-98', look:'pale', line:'¿Podría dejar de mirar la cámara? Le aseguro que estoy aquí.', question:'La última vez que me alojé aquí, aún había niños jugando en el tercer piso.', ledger:'INÉS GREY · HAB. 307 · CANCELADA HACE 14 AÑOS.', camera:'Cámara principal: el vestíbulo está VACÍO. Tú ves a alguien frente al mostrador.', trueGuest:false, hint:'Cámara vacía; la reserva fue cancelada hace catorce años.', note:'No se oye su respiración.'},
        {name:'GALA NAVARRO', room:'216', id:'GN-216-98', look:'student', line:'Mi autobús se averió. Solo quiero dormir. ¿Queda abierta la cocina?', question:'Reservé por teléfono. Pagué la señal con tarjeta.', ledger:'GALA NAVARRO · HAB. 216 · CONFIRMADA · 00:20', camera:'Entrada: 00:17. Una joven espera bajo la lluvia con una mochila.', trueGuest:true, hint:'Sus datos encajan.',note:'La mochila lleva un parche de una banda de rock.'},
        {name:'DAMIÁN CRUZ', room:'201', id:'DC-201-88', look:'old', line:'Regresé por mi abrigo. Me dieron la 201 hace diez años.', question:'¿1998? Eso no puede ser. Ayer era 1988.', ledger:'DAMIÁN CRUZ · HAB. 201 · ESTANCIA FINALIZADA EN 1988.', camera:'Cámara de entrada: una silueta inmóvil. La marca horaria retrocede.', trueGuest:false, hint:'Su estancia terminó hace diez años.',note:'Su documento está fechado en 1988.'}
      ]
    },
    {
      subtitle:'LA ÚLTIMA NOCHE', date:'DOMINGO, 15 DE NOVIEMBRE DE 1998',
      opening:'El teléfono lleva sonando desde las 02:00. Al descolgarlo, alguien susurra tu nombre.',
      closing:'La habitación 404 aparece marcada en todos los planos. Los planos tienen tu letra.',
      guests:[
        {name:'SRA. BELL', room:'404', id:'SB-404-61', look:'oldwoman', line:'He venido a recoger lo que dejé detrás de la pared.', question:'Tu compañero me dejó pasar. Ya sabes lo que ocurrió después.', ledger:'SIN RESERVA. Nombre asociado a un incendio en 1961. Habitación 404: NO EXISTE.', camera:'Las luces se apagan cada vez que la huésped mira a la cámara.', trueGuest:false, hint:'No existe la habitación; el registro es de 1961.', note:'Las gotas de lluvia no tocan su abrigo.'},
        {name:'LUCAS PRIETO', room:'305', id:'LP-305-98', look:'traveler', line:'Voy a una boda. Tengo la reserva desde agosto.', question:'Mis padres llegan mañana. Querría dejarles un mensaje.', ledger:'LUCAS PRIETO · HAB. 305 · CONFIRMADA · 00:41', camera:'Entrada: 00:39. Un joven baja de un coche azul con una maleta.', trueGuest:true, hint:'Es un cliente legítimo.',note:'Ha doblado cuidadosamente su traje.'},
        {name:'NOA LERMA', room:'121', id:'NL-121-98', look:'hood', line:'No compruebes las cámaras. No me gusta que me graben.', question:'Mira mi documento. ¿Acaso no es suficiente?', ledger:'NOA LERMA · HAB. 121 · SIN RESERVA.', camera:'La cámara exterior muestra dos sombras. Solo hay una persona frente a ti.', trueGuest:false, hint:'No hay reserva y la cámara muestra una segunda sombra.',note:'Sujeta un llavero con el número 404.'},
        {name:'PABLO VIDAL', room:'119', id:'PV-119-98', look:'worker', line:'Vengo a sustituir las bombillas. Me han dejado una habitación para esta noche.', question:'Es la 119. Puede comprobarlo, el turno de mañana llamó hace una hora.', ledger:'PABLO VIDAL · HAB. 119 · CONFIRMADA · 01:15', camera:'Entrada: 01:12. Se observa una mochila de electricista.', trueGuest:true, hint:'Su reserva es válida.',note:'Tiene marcas de pintura en las manos.'},
        {name:'EL DIRECTOR', room:'404', id:'--404--', look:'director', line:'Llevo toda la noche esperando a que me dejes volver a mi habitación.', question:'¿No me reconoces? Tú fuiste quien cerró la puerta.', ledger:'EL DIRECTOR · FALLECIDO EN 1961 · HAB. 404: BORRADA.', camera:'La imagen muestra al RECEPCIONISTA de espaldas. No hay ningún director.', trueGuest:false, hint:'El director falleció hace décadas. No existe la 404.',note:'Su rostro es idéntico al del retrato del vestíbulo.'}
      ]
    }
  ]
};