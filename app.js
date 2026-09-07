(() => {
  const STORAGE_KEY = 'sonalzaSongDraftV2';
  const FEEDBACK_KEY = 'sonalzaExitFeedbackV2';
  const page = document.body.dataset.page;
  const REGION_KEY = 'sonalzaRegionV1';
  const LANGUAGE_KEY = 'sonalzaLanguageV1';
  const PREF_KEY = 'sonalzaLocalePreferenceV1';
  const DETECTED_REGION_KEY = 'sonalzaDetectedRegionV1';
  const REGION_OVERRIDE_KEY = 'sonalzaRegionOverrideV1';
  const REGIONS = {
    US: { code:'US', flag:'🇺🇸', labelEs:'Estados Unidos', labelEn:'United States', currency:'USD', defaultLanguage:'en' },
    MX: { code:'MX', flag:'🇲🇽', labelEs:'México', labelEn:'Mexico', currency:'MXN', defaultLanguage:'es' }
  };
  const PRICING = {
    song: { USD: 49, MXN: 599 },
    corrido: { USD: 249, MXN: 1999 },
    business: { USD: 499, MXN: 4999 },
    premium: { USD: 29, MXN: 299 },
    rush: { USD: 19, MXN: 199 },
    video: { USD: 29, MXN: 299 },
    second: { USD: 25, MXN: 249 }
  };
  const LIST_PRICING = {
    song: { USD: 79, MXN: 999 },
    corrido: { USD: 349, MXN: 2999 },
    business: { USD: 699, MXN: 7999 }
  };
  const DISCOUNT_LABELS = {
    song: { USD:'38% OFF', MXN:'40% OFF' },
    corrido: { USD:'29% OFF', MXN:'33% OFF' },
    business: { USD:'29% OFF', MXN:'38% OFF' }
  };
  const TEXT_EN = {"OFERTA DE LANZAMIENTO":"LAUNCH OFFER","Tu canción personalizada desde":"Your custom song from","Ver precios →":"See pricing →","Ideas":"Ideas","Estilos":"Styles","Precios":"Pricing","Cómo funciona":"How it works","Crear mi canción":"Create my song","Crear":"Create","Ideas para regalar":"Gift ideas","Estilos musicales":"Music styles","Música para negocios":"Music for business","MÚSICA PERSONALIZADA · HECHA EN ESPAÑOL PRIMERO":"CUSTOM MUSIC · BUILT AROUND YOUR STORY","Hay historias que no caben en una tarjeta.":"Some stories do not fit on a card.","Hazla canción.":"Turn yours into a song.","Cuéntanos nombres, recuerdos, frases y momentos reales. SONALZA los convierte en una canción con dirección musical latina, hecha para que la persona se reconozca dentro de ella.":"Share real names, memories, phrases, and moments. SONALZA turns them into a song with Latin musical direction, made so the person can recognize their own story in it.","No sé por dónde empezar":"I’m not sure where to start","Desde":"From","1 revisión incluida · entrega digital":"1 revision included · digital delivery","Brief guiado, fácil de llenar":"Guided brief, easy to complete","Corrido, banda, cumbia y más":"Corrido, banda, cumbia and more","1 revisión incluida":"1 revision included","SONALZA · SESIÓN CREATIVA":"SONALZA · CREATIVE SESSION","Tu historia, dirigida como una pieza única":"Your story, directed as a one-of-a-kind piece","Historia real":"Real story","Detalles, nombres y recuerdos tuyos.":"Your details, names, and memories.","Identidad musical":"Musical identity","Corrido, banda, norteño, cumbia y más.":"Corrido, banda, norteño, cumbia and more.","Para ajustar la dirección si hace falta.":"To adjust the direction if needed.","USD o MXN":"Country-based pricing","Elige la moneda antes de ordenar.":"Your country sets the currency and regional price.","EMPIEZA POR LA EMOCIÓN":"START WITH THE EMOTION","No necesitas saber de música. Solo saber qué quieres decir.":"You do not need to know music. You only need to know what you want to say.","Elige la idea que más se parezca a la tuya y te llevamos al brief con parte de la dirección ya preparada.":"Choose the idea closest to yours and we will take you into the brief with part of the direction already prepared.","Para alguien que amo":"For someone I love","Aniversario, pareja, agradecimiento o simplemente decir lo que a veces cuesta poner en palabras.":"Anniversary, partner, gratitude, or simply saying what can be hard to put into words.","Empezar esta canción →":"Start this song →","RAÍZ":"ROOTS","Para mamá, papá o familia":"For mom, dad, or family","Una historia de raíces, sacrificios, recuerdos y todo lo que esa persona dejó en ti.":"A story of roots, sacrifices, memories, and everything that person left in you.","Contar nuestra historia →":"Tell our story →","VIDA":"LIFE","Quiero contar una vida":"I want to tell a life story","Trayectoria, migración, trabajo, familia, logros y legado contados como una pieza más profunda.":"A life journey, migration, work, family, achievements, and legacy told as a deeper piece.","Crear mi corrido →":"Create my corrido →","MARCA":"BRAND","Quiero música para mi negocio":"I want music for my business","Jingles, hooks y piezas memorables para anuncios, redes, productos o identidad de marca.":"Jingles, hooks, and memorable pieces for ads, social media, products, or brand identity.","Ver opción comercial →":"See business option →","EL ENFOQUE SONALZA":"THE SONALZA APPROACH","No empezamos con una plantilla.":"We do not start with a template.","Empezamos contigo.":"We start with you.","Una buena canción personalizada no se siente como un formulario convertido en música. Debe reconocer personas, lugares, frases, recuerdos y emociones que solamente ustedes entienden.":"A great custom song should not feel like a form turned into music. It should recognize people, places, phrases, memories, and emotions only you understand.","Historia primero":"Story first","Los detalles específicos son el material creativo, no un relleno.":"Specific details are the creative material, not filler.","Identidad musical real":"Real musical identity","No metemos todo dentro de “latino”. Corrido, banda, norteño, cumbia y mariachi tienen personalidad propia.":"We do not put everything under “Latin.” Corrido, banda, norteño, cumbia, and mariachi each have their own identity.","Una experiencia clara":"A clear experience","Tú eliges la dirección. Nosotros guiamos el brief para obtener mejores detalles.":"You choose the direction. We guide the brief to capture better details.","LATINO SIN CLICHÉS · HECHO CON RAÍCES":"LATIN WITHOUT CLICHÉS · ROOTED IN REAL STORIES","Nuestra música cambia de acento, de ritmo y de historia.":"Our music changes with the accent, rhythm, and story.","Familia, amor, trabajo, migración, celebración, sacrificios y legado. No reducimos “lo latino” a un solo sonido: cuidamos el género, las palabras y la emoción que pide cada historia.":"Family, love, work, migration, celebration, sacrifice, and legacy. We do not reduce “Latin” to one sound: we respect the genre, words, and emotion each story calls for.","RAÍCES":"ROOTS","Que suene cercana, no prefabricada.":"Make it feel close, not manufactured.","El género, las palabras y el tono deben respetar de dónde viene la historia.":"The genre, words, and tone should respect where the story comes from.","EMOCIÓN":"EMOTION","Que diga eso que no siempre sabemos decir.":"Say what we do not always know how to say.","La meta es que nombres, frases y recuerdos provoquen reconocimiento real.":"The goal is for names, phrases, and memories to create genuine recognition.","RITMO":"RHYTHM","Que tenga alma, pero también movimiento.":"Give it soul, but also movement.","Podemos emocionar con un mariachi, contar con un corrido o celebrar con una cumbia.":"We can move someone with mariachi, tell a story with corrido, or celebrate with cumbia.","Elige el mundo musical de tu historia.":"Choose the musical world of your story.","HISTORIAS QUE SUENAN":"STORIES THAT SOUND LIKE YOU","Desde una historia familiar contada como corrido hasta una cumbia para celebrar, el género cambia por completo la emoción de la canción.":"From a family story told as a corrido to a cumbia made to celebrate, the genre completely changes the emotion of the song.","Vida, migración, familia, logros, legado y momentos que merecen quedar contados.":"Life, migration, family, achievements, legacy, and moments worth preserving.","REGIONAL MEXICANO":"REGIONAL MEXICAN","Metales, emoción y una energía grande para historias grandes.":"Brass, emotion, and big energy for big stories.","PODER + EMOCIÓN":"POWER + EMOTION","Acordeón, cercanía y sabor para historias románticas o de familia.":"Accordion, warmth, and character for romantic or family stories.","RAÍZ + SENTIMIENTO":"ROOTS + FEELING","Para celebrar, bailar y convertir un recuerdo en algo imposible de quedarse sentado.":"For celebrating, dancing, and turning a memory into something impossible to sit still to.","RITMO + ALEGRÍA":"RHYTHM + JOY","Clásico, emotivo y directo al corazón para familia, amor y homenajes.":"Classic, emotional, and straight to the heart for family, love, and tributes.","TRADICIÓN + ALMA":"TRADITION + SOUL","Más estilos":"More styles","Duranguense, huapango, sierreño, pop latino, reguetón, balada y más.":"Duranguense, huapango, sierreño, Latin pop, reggaeton, ballads, and more.","TÚ ELIGES":"YOU CHOOSE","TRES FORMAS DE CREAR CON SONALZA":"THREE WAYS TO CREATE WITH SONALZA","Elige qué quieres convertir en música.":"Choose what you want to turn into music.","La canción personal, la historia de vida y la música para negocios son productos distintos. Cada uno necesita un proceso distinto.":"A personal song, a life story, and music for business are different products. Each needs a different process.","PARA REGALAR":"TO GIFT","Canción Personalizada":"Custom Song","Cumpleaños, aniversario, agradecimiento, amor, amistad, familia o simplemente porque sí.":"Birthday, anniversary, gratitude, love, friendship, family, or simply because.","OFERTA DE LANZAMIENTO · TIEMPO LIMITADO":"LAUNCH OFFER · LIMITED TIME","PRECIO ESPECIAL":"SPECIAL PRICE","Ahorras":"You save","Canción completa personalizada":"Complete custom song","Género, voz e idioma":"Genre, voice, and song language","Brief guiado de tu historia":"Guided story brief","Comenzar mi canción →":"Start my song →","HISTORIA DE VIDA":"LIFE STORY","Corrido de Tu Vida":"Your Life Corrido","Una narrativa más profunda para contar trayectoria, raíces, familia, sacrificios y legado.":"A deeper narrative to tell a life journey, roots, family, sacrifice, and legacy.","Brief narrativo ampliado":"Expanded narrative brief","Dirección regional mexicana":"Regional Mexican direction","Mayor profundidad en la letra":"Deeper lyric development","Proceso premium":"Premium process","Quiero contar mi historia →":"I want to tell my story →","PARA NEGOCIOS":"FOR BUSINESS","Jingles y Música para Marcas":"Jingles & Brand Music","Hooks, jingles y piezas musicales para marcas, productos, anuncios y contenido social.":"Hooks, jingles, and musical pieces for brands, products, ads, and social content.","Brief comercial":"Business brief","Versiones cortas para redes":"Short versions for social","Opciones instrumental y vocal":"Instrumental and vocal options","Licencia según proyecto":"License based on project","Solicitar propuesta →":"Request a proposal →","Elige tu moneda":"Your country sets your price","Los precios se muestran en la moneda que selecciones y se mantienen durante el pedido.":"Choose your country above. United States orders are priced in USD; Mexico orders are priced in MXN.","* Oferta de lanzamiento por tiempo limitado. Los precios en MXN se fijaron comercialmente tomando como referencia el tipo de cambio vigente y se redondearon para mantener precios claros. No cambian automáticamente con el mercado. Impuestos y método de pago se validarán antes del cargo.":"* Limited-time launch offer. Regional prices are set commercially for each market and do not automatically track exchange rates. Taxes and payment method are validated before the charge.","TU SESIÓN CREATIVA":"YOUR CREATIVE SESSION","De un recuerdo a una canción.":"From a memory to a song.","No necesitas saber escribir letras ni hablar “como músico”. Solamente necesitas conocer tu propia historia.":"You do not need to write lyrics or speak “like a musician.” You only need to know your own story.","Iniciar el brief creativo →":"Start the creative brief →","Define para quién es":"Define who it is for","Nombre, relación y ocasión. Ese es el contexto emocional.":"Name, relationship, and occasion. That is the emotional context.","Danos los detalles que nadie más conoce":"Give us the details no one else knows","Recuerdos, cualidades, lugares, frases y pequeños detalles reales.":"Memories, qualities, places, phrases, and small real details.","Elige la dirección musical":"Choose the musical direction","Género, voz e idioma para que la canción se sienta correcta.":"Genre, voice, and song language so it feels right.","Recibe algo hecho para esa historia":"Receive something made for that story","La meta no es solamente que suene bien. Es que se reconozcan dentro de ella.":"The goal is not only for it to sound good. It is for them to recognize themselves in it.","EL ESTÁNDAR SONALZA":"THE SONALZA STANDARD","Tu historia merece cuidado en cada detalle.":"Your story deserves care in every detail.","Desde el brief hasta la entrega, buscamos una experiencia clara, privada y profesional. Tú aportas la historia; SONALZA define la dirección creativa para convertirla en música.":"From the brief to delivery, we aim for a clear, private, professional experience. You bring the story; SONALZA shapes the creative direction to turn it into music.","TU HISTORIA YA EXISTE":"YOUR STORY ALREADY EXISTS","Ahora falta convertirla en música.":"Now it is time to turn it into music.","Crear mi canción →":"Create my song →","Crear canción →":"Create song →","Tu historia. Tu canción.":"Your story. Your song.","Negocios":"Business","Salir del estudio ×":"Exit studio ×","Paso 1 de 8":"Step 1 of 8","13% completado":"13% complete","TU BRIEF SONALZA":"YOUR SONALZA BRIEF","Fácil de llenar. Profundo donde importa.":"Easy to complete. Deep where it matters.","No necesitas escribir bonito ni saber de música. Te vamos guiando una pregunta a la vez.":"You do not need to write beautifully or know music. We guide you one question at a time.","3–5 minutos":"3–5 minutes","para completar el brief":"to complete the brief","Detalles reales":"Real details","nombres, recuerdos y frases":"names, memories, and phrases","Sin lenguaje técnico":"No technical language","nosotros traducimos la historia a música":"we translate the story into music","TIP SONALZA":"SONALZA TIP","Empieza simple.":"Start simple.","Elige para quién es. Nosotros te iremos pidiendo lo demás.":"Choose who it is for. We will guide you through the rest.","/ TU HISTORIA, TU CANCIÓN":"/ YOUR STORY, YOUR SONG","Una pregunta a la vez":"One question at a time","Tu avance se guarda en este dispositivo":"Your progress is saved on this device","← Atrás":"← Back","Siguiente →":"Next →","ANTES DE CERRAR":"BEFORE YOU LEAVE","¿Qué te hizo detenerte?":"What made you stop?","Esta respuesta nos ayuda a mejorar SONALZA y entender qué necesita el cliente antes de ordenar.":"This helps us improve SONALZA and understand what customers need before ordering.","Precio":"Price","El costo se siente más alto de lo esperado.":"The cost feels higher than expected.","Quiero escuchar más":"I want to hear more","Necesito más ejemplos antes de decidir.":"I need more examples before deciding.","Dudas sobre mi historia":"Concerns about my story","No sé si podrán capturarla como quiero.":"I am not sure you can capture it the way I want.","No encontré mi estilo":"I did not find my style","Busco otro género o dirección musical.":"I am looking for another genre or musical direction.","Forma de pago":"Payment method","Necesito una opción de pago diferente.":"I need a different payment option.","Sigo comparando":"I am still comparing","Todavía estoy explorando opciones.":"I am still exploring options.","Otro motivo":"Another reason","Algo distinto a lo anterior.":"Something different from the options above.","En esta versión de prueba, la respuesta se guarda únicamente en este navegador.":"In this test version, the response is saved only in this browser.","¿Para quién es esta canción?":"Who is this song for?","Elige la relación más cercana. Si no aparece exactamente, selecciona “Otro”.":"Choose the closest relationship. If it is not listed exactly, select “Other.”","¿Por qué te lo preguntamos?":"Why do we ask?","La relación cambia el tono de la letra y la forma de contar la historia.":"The relationship changes the tone of the lyrics and how the story is told.","Esposo":"Husband","Esposa":"Wife","Pareja":"Partner","Novio":"Boyfriend","Novia":"Girlfriend","Papá":"Dad","Mamá":"Mom","Hijo":"Son","Hija":"Daughter","Abuelo/a":"Grandparent","Hermano/a":"Sibling","Amigo/a":"Friend","Para mí":"Myself","Otro":"Other","¿Cómo se llama?":"What is their name?","Escribe el nombre tal como quieres que aparezca o se cante.":"Write the name exactly as you want it to appear or be sung.","Ejemplo":"Example","“José”, “Mamá Lupita”, “Mi viejo”, “César”. Usa la forma que realmente le dices.":"“José,” “Mom Lupita,” “Mi viejo,” “César.” Use the name you actually call them.","Nombre":"Name","Ejemplo: Julián":"Example: Julian","Así lo usaremos dentro del formulario.":"This is how we will use it in the brief.","¿Cuál es la ocasión?":"What is the occasion?","Elige la ocasión que mejor explica por qué estás creando esta canción.":"Choose the occasion that best explains why you are creating this song.","No tiene que ser una fecha especial.":"It does not have to be a special date.","“Porque sí”, “Te amo” o “Gracias” también pueden producir canciones muy fuertes.":"“Just because,” “I love you,” or “Thank you” can also make powerful songs.","Porque sí":"Just because","Te amo":"I love you","Cumpleaños":"Birthday","Aniversario":"Anniversary","Te extraño":"Missing you","Gracias":"Thank you","Perdón":"Apology","Boda":"Wedding","Amistad":"Friendship","En memoria":"In memory","Logro especial":"Milestone","Propuesta":"Proposal","Jubilación":"Retirement","Graduación":"Graduation","Otra ocasión":"Something else","Elige el estilo de la canción":"Choose the song style","Elige la dirección musical. Si no estás seguro, “Sorpréndeme” nos deja proponerla.":"Choose the musical direction. If you are not sure, “Surprise me” lets us propose one.","Piensa en la persona que la recibirá.":"Think about the person receiving it.","No elijas solo tu género favorito: elige el que más conectaría con esa historia.":"Do not choose only your favorite genre; choose the one that best connects with the story.","Sorpréndeme":"Surprise me","Voz":"Voice","Masculina":"Male","Femenina":"Female","Idioma de la canción":"Song language","Español":"Spanish","Inglés":"English","Bilingüe":"Bilingual","Sus mejores cualidades":"Their best qualities","Cómo es":"What they are like","Qué admiras":"What you admire","Qué hace por ustedes":"What they do for you","Escribe natural. No necesitas rimar.":"Write naturally. You do not need to rhyme.","Comparte un recuerdo inolvidable":"Share an unforgettable memory","Los detalles específicos hacen que la canción se sienta verdaderamente personal.":"Specific details make the song feel truly personal.","Un lugar":"A place","Una anécdota":"A story","Una frase":"A phrase","Un momento":"A moment","Momento especial":"Special moment","Entre más específico, menos genérica se sentirá la canción.":"The more specific you are, the less generic the song will feel.","¿Qué quieres que sienta al escucharla?":"What do you want them to feel when they hear it?","Dinos el mensaje que debe quedar en el corazón de quien la reciba.":"Tell us the message you want to remain in their heart.","Frase que te gustaría escuchar":"Phrase you would like to hear","(opcional)":"(optional)","Puede ser una frase familiar o algo que tú quieres decirle.":"It can be a family phrase or something you want to say.","Mensaje principal":"Main message","Piensa en cómo quieres que se sienta al terminar.":"Think about how you want them to feel at the end.","Paso final":"Final step","¿A dónde enviamos tu canción?":"Where should we send your song?","Usaremos estos datos para identificar tu pedido y comunicarnos contigo sobre la entrega.":"We will use these details to identify your order and contact you about delivery.","Tu historia es privada.":"Your story is private.","No necesitas publicar nada para crear tu canción.":"You do not need to publish anything to create your song.","Correo electrónico":"Email address","Teléfono":"Phone","Más adelante podremos usarlo para avisos de entrega por mensaje de texto.":"Later we may use it for delivery updates by text message.","Revisar mi pedido →":"Review my order →","Escribe un correo electrónico válido para continuar.":"Enter a valid email address to continue.","Completa esta información para continuar.":"Complete this information to continue.","La relación nos ayuda a definir cercanía, lenguaje y tono emocional.":"The relationship helps us define closeness, language, and emotional tone.","Usa el nombre real.":"Use the real name.","Escribe cómo le dices de verdad. Ese detalle puede hacer que la canción se sienta mucho más personal.":"Write the name you actually use. That detail can make the song feel much more personal.","Define el motivo.":"Define the reason.","La ocasión nos ayuda a decidir qué debe quedar al frente: celebración, amor, gratitud, homenaje o memoria.":"The occasion helps us decide what should lead: celebration, love, gratitude, tribute, or memory.","El sonido también cuenta la historia.":"The sound also tells the story.","Un corrido narra distinto a una cumbia. Elige pensando en quién recibirá la canción.":"A corrido tells a story differently from a cumbia. Choose with the recipient in mind.","No busques palabras perfectas.":"Do not look for perfect words.","Escribe como hablas. Nosotros nos encargamos de convertir esas ideas en una letra musical.":"Write the way you speak. We will turn those ideas into musical lyrics.","Los detalles pequeños son oro.":"Small details are gold.","Lugares, apodos, frases y momentos concretos son lo que evita que la canción se sienta genérica.":"Places, nicknames, phrases, and specific moments are what keep the song from feeling generic.","Piensa en la última sensación.":"Think about the final feeling.","¿Quieres que sonría, llore, se sienta orgulloso o quiera bailar? Dínoslo tal cual.":"Do you want them to smile, cry, feel proud, or want to dance? Tell us directly.","Ya casi está.":"Almost there.","Tu correo identifica el pedido y será el canal principal para la entrega y cualquier aclaración.":"Your email identifies the order and will be the main channel for delivery and any questions.","← Editar mi brief":"← Edit my brief","ÚLTIMO REPASO":"FINAL REVIEW","Tu historia ya está armada.":"Your story is ready.","Revisa lo esencial, elige si quieres algún extra y envía el pedido. No te cobraremos nada hasta que el checkout esté conectado y veas el total final claramente.":"Review the essentials, choose any extras, and submit the order. You will not be charged until checkout is connected and you clearly see the final total.","✓ Brief guardado":"✓ Brief saved","✓ Moneda visible":"✓ Regional price locked","✓ 1 revisión incluida":"✓ 1 revision included","BRIEF / 01":"BRIEF / 01","SONALZA SESSION":"SONALZA SESSION","Tu historia":"Your story","Incluye 1 revisión":"Includes 1 revision","Si la dirección se aleja de manera importante de lo que nos compartiste, corregiremos el enfoque dentro del alcance de la revisión incluida.":"If the direction significantly misses what you shared, we will correct the approach within the included revision.","ORDEN / 02":"ORDER / 02","PERSONALIZA":"CUSTOMIZE","Tu pedido":"Your order","POR TIEMPO LIMITADO":"LIMITED TIME","Canción personalizada":"Custom Song","Precio promocional aplicado":"Promotional price applied","Descuento de lanzamiento":"Launch discount","Recuerdo Premium":"Premium Keepsake","Letra diseñada + tarjeta con QR + portada personalizada.":"Designed lyrics + QR card + custom cover.","Entrega prioritaria":"Priority delivery","Tu pedido entra a la fila de producción prioritaria.":"Your order enters the priority production queue.","Video vertical con letra":"Vertical lyric video","Preparado para Reels, TikTok y Shorts.":"Prepared for Reels, TikTok, and Shorts.","Segunda versión":"Second version","La misma historia con una segunda dirección musical.":"The same story with a second musical direction.","Total":"Total","Moneda del pedido":"Order currency","¿Qué pasa al enviarlo?":"What happens when you submit?","Registramos tu brief con un número de pedido y lo enviamos a SONALZA. El checkout de pago se conectará como siguiente integración; mientras tanto no se realiza ningún cargo.":"We register your brief with an order number and send it to SONALZA. Payment checkout will be connected in the next integration; until then no charge is made.","Recibimos tu brief":"We receive your brief","Tu historia queda asociada a un número de pedido.":"Your story is linked to an order number.","Confirmamos y producimos":"We confirm and produce","Revisamos la dirección antes de preparar la canción.":"We review the direction before preparing the song.","Entrega digital":"Digital delivery","Recibes tu canción y puedes usar la revisión incluida.":"You receive your song and can use the included revision.","Enviar mi pedido →":"Submit my order →","¿Qué te hizo dudar?":"What made you hesitate?","El total es más alto de lo esperado.":"The total is higher than expected.","No veo la opción que prefiero.":"I do not see my preferred option.","Dudas del producto":"Product concerns","Necesito entender mejor lo que recibo.":"I need to better understand what I receive.","Problema técnico":"Technical issue","Algo no funcionó como esperaba.":"Something did not work as expected.","Todavía no estoy listo para ordenar.":"I am not ready to order yet.","Mi motivo es diferente.":"My reason is different.","Para":"For","Ocasión":"Occasion","Estilo":"Style","Idioma":"Language","Correo":"Email","Sin nombre":"No name","Sin especificar":"Not specified","← Volver a servicios":"← Back to services","MÚSICA PARA NEGOCIOS":"MUSIC FOR BUSINESS","Haz que tu marca también tenga sonido.":"Give your brand a sound of its own.","Cuéntanos qué vendes, a quién quieres llegar y dónde se escuchará la pieza. Te responderemos con la dirección recomendada para tu proyecto.":"Tell us what you sell, who you want to reach, and where the piece will be heard. We will respond with the recommended direction for your project.","BRIEF COMERCIAL":"BUSINESS BRIEF","Jingle, hook o música de marca.":"Jingle, hook, or brand music.","Ideal para anuncios, contenido social, campañas, producto, radio, YouTube y piezas cortas para TikTok o Reels.":"Ideal for ads, social content, campaigns, products, radio, YouTube, and short pieces for TikTok or Reels.","Dirección creativa según marca":"Creative direction based on your brand","Opciones vocales e instrumentales":"Vocal and instrumental options","Versiones cortas según proyecto":"Short versions based on project","Licencia definida antes de producir":"License defined before production","Tu nombre":"Your name","Nombre del negocio":"Business name","Tipo de proyecto":"Project type","Selecciona…":"Select…","Jingle completo":"Full jingle","Hook para redes":"Social media hook","Música para anuncio":"Music for an ad","Identidad sonora":"Sonic identity","Presupuesto aproximado":"Approximate budget","Prefiero hablarlo":"I prefer to discuss it","Cuéntanos qué necesitas":"Tell us what you need","Enviar solicitud →":"Submit request →","Enviando…":"Sending…","SOLICITUD RECIBIDA":"REQUEST RECEIVED","Ya llegó a SONALZA.":"SONALZA has received it.","Volver al inicio →":"Back to home →","BRIEF RECIBIDO":"BRIEF RECEIVED","Tu historia ya llegó a SONALZA.":"Your story has reached SONALZA.","Guardamos los datos de tu pedido. Conserva este número como referencia:":"We saved your order details. Keep this number as your reference:","Cuando activemos el checkout, esta misma página podrá continuar directamente al pago. Por ahora, el equipo de SONALZA recibe tu información para seguimiento.":"When checkout is activated, this page will be able to continue directly to payment. For now, the SONALZA team receives your information for follow-up.","Volver a SONALZA →":"Back to SONALZA →"};
  Object.assign(TEXT_EN, {
    'Precio regional':'Regional pricing',
    'EE. UU. en USD · México en MXN.':'U.S. in USD · Mexico in MXN.',
    'Tu país define el precio':'Your country sets the price',
    'Estados Unidos se cobra en USD. México se cobra en MXN. El idioma lo eliges tú.':'United States orders are charged in USD. Mexico orders are charged in MXN. You choose the language.',
    '* Oferta de lanzamiento por tiempo limitado. Los precios son regionales: Estados Unidos se cobra en USD y México en MXN. No son una conversión automática del tipo de cambio. Impuestos y método de pago se validarán antes del cargo.':'* Limited-time launch offer. Prices are regional: United States orders are charged in USD and Mexico orders in MXN. They are not an automatic exchange-rate conversion. Taxes and payment method are validated before the charge.',
    'Paso 1':'Step 1','Paso 2':'Step 2','Paso 3':'Step 3','Paso 4':'Step 4','Paso 5':'Step 5','Paso 6':'Step 6','Paso 7':'Step 7',
    'Ejemplo: Siempre ha cuidado de nuestra familia, tiene un gran sentido del humor y nunca deja que nadie se rinda.':'Example: They have always taken care of our family, have a great sense of humor, and never let anyone give up.',
    'Ejemplo: Nos conocimos trabajando en Anaheim. Siempre dice ‘primero la familia’. El viaje a Chihuahua en 2018 fue cuando…':'Example: We met while working in Anaheim. They always say “family first.” The trip to Chihuahua in 2018 was when…',
    'Ejemplo: Gracias por cruzar fronteras por nosotros.':'Example: Thank you for crossing borders for us.',
    'Ejemplo: Quiero que entienda que todo su esfuerzo valió la pena y que estamos orgullosos de él.':'Example: I want him to know that all his effort was worth it and that we are proud of him.',
    'tu@correo.com':'you@email.com',
    'Qué hace tu negocio, qué quieres comunicar, dónde se usará la música y cualquier referencia útil.':'What your business does, what you want to communicate, where the music will be used, and any useful reference.',
    'Canción personalizada':'Custom Song',
    'Registrando tu pedido…':'Registering your order…',
    'No pudimos registrar el pedido.':'We could not register the order.',
    'FAMILIA':'FAMILY',
    'AMOR':'LOVE',
    'MIGRACIÓN':'MIGRATION',
    'CELEBRACIÓN':'CELEBRATION',
    'LEGADO':'LEGACY',
    'MEMORIA':'MEMORY',
    'HECHO CON RAÍCES · DIRIGIDO CON CRITERIO':'ROOTED IN CULTURE · DIRECTED WITH INTENTION',
    'Que se sienta latino antes de tener que explicarlo.':'Let it feel Latin before it ever needs an explanation.',
    'Familia, amor, migración, fiesta, sacrificio y legado. SONALZA no usa “lo latino” como decoración: lo trata como contexto, lenguaje, ritmo y memoria.':'Family, love, migration, celebration, sacrifice, and legacy. SONALZA does not use “Latin” as decoration: we treat it as context, language, rhythm, and memory.',
    'SONALZA / RAÍCES':'SONALZA / ROOTS',
    'De nuestras historias':'From our stories',
    'a tu canción.':'to your song.',
    'Historias que vienen de lejos.':'Stories that began long before us.',
    'Familia, trabajo, migración, sacrificios y todo lo que merece quedar contado.':'Family, work, migration, sacrifice, and everything worth preserving in a song.',
    'También se recuerda bailando.':'Some memories are meant to be danced.',
    'Lo que alguien deja en nosotros.':'What someone leaves behind in us.',
    '01 · PALABRAS':'01 · WORDS',
    'Que hable como habla tu historia.':'Let it speak the way your story speaks.',
    'Nombres, frases y expresiones reales tienen más peso que cualquier cliché.':'Real names, phrases, and expressions carry more weight than any cliché.',
    '02 · SONIDO':'02 · SOUND',
    'Que el género tenga identidad propia.':'Let each genre keep its own identity.',
    'Corrido, banda, norteño, cumbia y mariachi no son la misma cosa.':'Corrido, banda, norteño, cumbia, and mariachi are not the same thing.',
    '03 · EMOCIÓN':'03 · EMOTION',
    'Que la persona se reconozca dentro.':'Let the person recognize themselves in it.',
    'La meta es provocar memoria, orgullo, risa, nostalgia o ganas de bailar.':'The goal is to spark memory, pride, laughter, nostalgia, or the urge to dance.',
    'No pudimos enviar la solicitud.':'We could not send the request.',
    'Tu historia merece cuidado en cada detalle.':'Your story deserves care in every detail.',
    'Desde el brief hasta la entrega, buscamos una experiencia clara, privada y profesional. Tú aportas la historia; SONALZA define la dirección creativa para convertirla en música.':'From the brief to delivery, we aim for a clear, private, and professional experience. You bring the story; SONALZA defines the creative direction to turn it into music.',
    'Historia real':'Real story',
    'Dirección musical':'Musical direction',
    'Entrega cuidada':'Careful delivery',
    'Historias que suenan':'Stories that resonate',
    'TU HISTORIA YA EXISTE':'YOUR STORY ALREADY EXISTS',
    'Ahora falta convertirla en música.':'Now turn it into music.',
    'Regala algo que no se guarda en un cajón: una canción creada alrededor de nombres, recuerdos y momentos reales.':'Give something that does not end up in a drawer: a song created around real names, memories, and moments.',
    'Más historias.':'More stories.',
    'Más música.':'More music.',
    'Un mundo mejor.':'A better world.',
    'Navegación':'Navigation',
    'Soporte':'Support',
    'Legal':'Legal',
    'Preguntas frecuentes':'Frequently asked questions',
    'Contáctanos':'Contact us',
    'Política de privacidad':'Privacy policy',
    'Términos de servicio':'Terms of service',
    'Precio regional según país':'Regional pricing by country',
    'Diseñado para historias con raíz latina.':'Designed for stories with Latin roots.',
    'Custom cover':'Custom cover',
    'Portada personalizada para tu canción. Puedes escribir la idea visual o subir una foto de referencia.':'A custom cover for your song. You can describe the visual idea or upload a reference photo.',
    'Escribe qué te gustaría ver en tu custom cover':'Write what you would like to see on your custom cover',
    'Puedes describir personas, colores, estilo, fondo, texto o la emoción que quieres transmitir.':'You can describe people, colors, style, background, text, or the emotion you want to convey.',
    'Upload foto you would like to use as cover':'Upload photo you would like to use as cover',
    'La portada se usará en tamaño cuadrado. Trata de dejar visible lo más importante.':'The cover will be used in a square format. Try to keep the most important part visible.',
    'Dinos qué sí o sí debe verse una vez que recortemos la imagen':'Tell us what absolutely must remain visible once we crop the image',
    'Esto nos ayuda a no cortar justo lo importante cuando adaptemos la imagen al formato cuadrado.':'This helps us avoid cropping out what matters when we adapt the image to the square format.',
    'Ejemplo: Un retrato elegante de mi papá con sombrero, tonos dorados, su nombre al frente y una vibra emotiva.':'Example: An elegant portrait of my dad with a hat, golden tones, his name on the front, and an emotional vibe.',
    'Ejemplo: Que se vea completa la cara, el sombrero y el nombre Derek.':'Example: Make sure the full face, the hat, and the name Derek remain visible.',

    'ANTES DE EMPEZAR':'BEFORE YOU START',
    '¿Qué quieres crear?':'What would you like to create?',
    'Primero elige el tipo de canción. Después te hacemos una pregunta a la vez.':'First choose the type of song. Then we guide you one question at a time.',
    'OPCIÓN ESENCIAL':'ESSENTIAL OPTION',
    'Canción Personalizada':'Custom Song',
    'Para una persona, ocasión o momento específico. Ideal para cumpleaños, aniversario, familia, pareja, agradecimiento o regalo.':'For a specific person, occasion, or moment. Ideal for birthdays, anniversaries, family, partners, gratitude, or a gift.',
    'Precio de lanzamiento':'Launch price',
    'Historia personal y detalles reales':'Personal story and real details',
    'Eliges género, voz e idioma':'Choose genre, voice, and language',
    'Elegir esta opción →':'Choose this option →',
    'HISTORIA DE VIDA':'LIFE STORY',
    'Corrido de una Vida':'A Life Corrido',
    'Para contar una trayectoria con más profundidad: raíces, familia, trabajo, migración, sacrificios, logros o legado.':'To tell a life journey in greater depth: roots, family, work, migration, sacrifices, achievements, or legacy.',
    'Puede ser tu historia o la de alguien más.':'It can be your story or someone else’s.',
    'Historia más amplia y narrativa':'Deeper, more narrative story',
    'Corrido como dirección principal':'Corrido as the primary direction',
    'Proceso premium y 1 revisión incluida':'Premium process and 1 revision included',
    'No importa quién sea el protagonista: tú, tu papá, tu mamá, tu pareja, un amigo o cualquier persona cuya historia quieras convertir en música.':'The main character can be you or someone else—your parent, partner, friend, or anyone whose story you want to turn into music.',
    'Cambiar opción':'Change option',
    'TU FORMULARIO SONALZA':'YOUR SONALZA BRIEF',
    'para completar el formulario':'to complete the brief',
    'Así lo usaremos dentro del formulario.':'This is how we will use it in the brief.',
    'Formulario guiado, fácil de llenar':'Guided brief, easy to complete',
    'Formulario guiado de tu historia':'Guided story brief',
    'Formulario narrativo ampliado':'Expanded narrative brief',
    'Iniciar el formulario →':'Start the brief →',
    'Nosotros guiamos el formulario para obtener mejores detalles.':'We guide the brief to capture better details.',
    'te llevamos al formulario con parte de la dirección ya preparada':'we take you into the brief with part of the direction already prepared',
    'Desde el formulario hasta la entrega, buscamos una experiencia clara, privada y profesional. Tú aportas la historia; SONALZA define la dirección creativa para convertirla en música.':'From the brief to delivery, we aim for a clear, private, professional experience. You bring the story; SONALZA defines the creative direction to turn it into music.',
    '← Editar mi formulario':'← Edit my brief',
    '✓ Formulario guardado':'✓ Brief saved',
    'FORMULARIO / 01':'BRIEF / 01',
    'Registramos tu formulario con un número de pedido y lo enviamos a SONALZA. El checkout de pago se conectará como siguiente integración; mientras tanto no se realiza ningún cargo.':'We register your brief with an order number and send it to SONALZA. Payment checkout will be connected in the next integration; until then no charge is made.',
    'Recibimos tu formulario':'We receive your brief',
    'FORMULARIO COMERCIAL':'BUSINESS BRIEF',
    'FORMULARIO RECIBIDO':'BRIEF RECEIVED',
    'Revisamos tu formulario':'We review your brief',
    'Formulario comercial':'Business brief',
    'Para una persona, ocasión o mensaje específico. Puedes elegir corrido, banda, cumbia, mariachi y más.':'For a specific person, occasion, or message. You can choose corrido, banda, cumbia, mariachi, and more.',
    'Para una persona, ocasión o momento específico. Puedes elegir corrido, banda, cumbia, mariachi y más; el enfoque es una historia concreta, no contar una vida completa.':'For a specific person, occasion, or moment. You can choose corrido, banda, cumbia, mariachi, and more; the focus is one specific story, not an entire life.',
    'Para contar una trayectoria completa con más profundidad: raíces, familia, trabajo, migración, sacrificios, logros o legado.':'To tell a complete life journey in greater depth: roots, family, work, migration, sacrifices, achievements, or legacy.',

    'Confirmo que leí y acepto los Términos y condiciones y la Política de privacidad, incluyendo las reglas de revisiones, cancelaciones, licencias y entrega.':'I confirm that I have read and agree to the Terms & Conditions and Privacy Policy, including revision, cancellation, licensing, and delivery rules.',
    'Confirmo que tengo derecho o autorización para enviar la historia, nombres, fotos y demás materiales. Si incluyo voluntariamente datos personales sensibles sobre mí, autorizo su tratamiento únicamente para preparar y administrar mi pedido; no enviaré datos sensibles de terceros sin autorización o base legal suficiente.':'I confirm that I have the right or authorization to submit the story, names, photos, and other materials. If I voluntarily include sensitive personal information about myself, I expressly authorize its processing only to prepare and administer my order; I will not submit third-party sensitive data without authorization or sufficient legal basis.',
    'Estas aceptaciones se guardan con la versión legal aplicable al pedido.':'These acceptances are stored with the legal version applicable to the order.',
    'Acepto la Política de privacidad y autorizo a SONALZA a usar estos datos para responder sobre este proyecto.':'I agree to the Privacy Policy and authorize SONALZA to use this information to respond about this project.',
    'No usaremos tu solicitud como publicidad sin autorización expresa.':'We will not use your request in advertising without express permission.',
  });


  Object.assign(TEXT_EN, {
    'ELIGE TU EXPERIENCIA':'CHOOSE YOUR EXPERIENCE',
    'Elige primero el nivel de profundidad. Después te guiamos una pregunta a la vez.':'First choose how deep you want to go. Then we guide you one question at a time.',
    'CANCIÓN PERSONALIZADA':'CUSTOM SONG',
    'Una historia, un momento.':'One story, one moment.',
    'Para una persona, ocasión o mensaje específico. Puedes elegir corrido, banda, cumbia, mariachi y más.':'For a specific person, occasion, or message. You can choose corrido, banda, cumbia, mariachi, and more.',
    'Cualquier género':'Any genre',
    '1 revisión':'1 revision',
    'Elegir Canción Personalizada →':'Choose Custom Song →',
    'CORRIDO DE UNA VIDA':'A LIFE CORRIDO',
    'Una vida merece más espacio.':'A life deserves more space.',
    'Una narrativa biográfica más profunda sobre raíces, familia, trabajo, migración, retos, logros y legado.':'A deeper biographical narrative about roots, family, work, migration, challenges, achievements, and legacy.',
    'Historia ampliada':'Expanded story',
    'Elegir Corrido de una Vida →':'Choose A Life Corrido →',
    '¿Cuál es la diferencia?':'What is the difference?',
    'Canción Personalizada se enfoca en un momento, mensaje u ocasión. Corrido de una Vida desarrolla una trayectoria completa y por eso hace preguntas adicionales sobre raíces, familia, retos, logros y legado.':'Custom Song focuses on a moment, message, or occasion. A Life Corrido develops a full life journey, so it asks additional questions about roots, family, challenges, achievements, and legacy.',
    'El protagonista puede ser tú o cualquier otra persona. El precio cambia por la profundidad del proceso, no simplemente por elegir el género corrido.':'The main person can be you or anyone else. The price changes because of the depth of the process, not simply because you choose corrido as a genre.',
    'Portada personalizada':'Custom cover',
    'Portada personalizada para tu canción. Describe la idea o sube una foto de referencia.':'A custom cover for your song. Describe the idea or upload a reference photo.',
    'Describe cómo quieres que se vea tu portada':'Describe how you want your cover to look',
    'Subir foto para usar en la portada':'Upload a photo to use on the cover',
    'La portada tendrá formato cuadrado. Procura que lo más importante quede cerca del centro.':'The cover will use a square format. Try to keep the most important part near the center.',
    '¿Qué debe quedar visible después del recorte?':'What must remain visible after cropping?',
    'Esto nos ayuda a proteger lo importante cuando adaptemos la foto al formato cuadrado.':'This helps us protect what matters when we adapt the photo to a square format.',
    'Precio de lanzamiento':'Launch price',
    'Proceso de pago':'Checkout',
    'Modo de prueba':'Test mode',
    'No se realizará ningún cargo en esta etapa.':'No charge will be made at this stage.',
    'ANTES DE ELEGIR':'BEFORE YOU CHOOSE',
    'Escucha el universo SONALZA.':'Hear the SONALZA universe.',
    'Una canción personalizada se entiende mejor cuando puedes escuchar la dirección musical. Nuestro canal reúne canciones y ejemplos de distintos estilos.':'A custom song makes more sense when you can hear the musical direction. Our channel brings together songs and examples across different styles.',
    'Historias, raíces y trayectoria.':'Stories, roots, and life journeys.',
    'Celebración, movimiento y recuerdos.':'Celebration, movement, and memories.',
    'Acordeón, cercanía y emoción.':'Accordion, warmth, and emotion.',
    'Escuchar más en YouTube →':'Hear more on YouTube →',
    'Canciones reales publicadas por SONALZA.':'Real songs published by SONALZA.',
    'Cuando activemos el pago seguro, podrás continuar sin volver a llenar tu información.':'When secure payment is enabled, you can continue without filling in your information again.',
    'Escucha':'Listen',
    'Crear este corrido →':'Create this corrido →',
    'Una narrativa más profunda para contar una trayectoria completa — tuya o de alguien más — con raíces, familia, sacrificios y legado.':'A deeper narrative for telling a complete life journey—yours or someone else’s—with roots, family, sacrifice, and legacy.',
    'Crear Corrido de una Vida →':'Create A Life Corrido →',
    'Escuchar ejemplos':'Hear examples',
    'Homenaje':'Tribute',
    'Legado familiar':'Family legacy',
    'Regalo especial':'Special gift',
    'Porque su historia merece contarse':'Because their story deserves to be told',
    'Corrido clásico':'Classic corrido',
    'Corrido moderno':'Modern corrido',
    'Norteño-corrido':'Norteño-corrido',
    'Sierreño-corrido':'Sierreño-corrido',
    'Volver':'Back',
    'AYUDA SONALZA':'SONALZA HELP',
    'Preguntas frecuentes':'Frequently asked questions',
    'Respuestas claras antes de convertir una historia en canción.':'Clear answers before turning a story into a song.',
    '¿Qué necesito para crear una canción?':'What do I need to create a song?',
    'Solo necesitas conocer la historia. Nuestro formulario te guía con preguntas sobre la persona, recuerdos, frases, ocasión, género, voz e idioma.':'You only need to know the story. Our form guides you through the person, memories, phrases, occasion, genre, voice, and language.',
    '¿Cuál es la diferencia entre Canción Personalizada y Corrido de una Vida?':'What is the difference between Custom Song and A Life Corrido?',
    'La Canción Personalizada se enfoca en un momento, mensaje u ocasión. Corrido de una Vida desarrolla una trayectoria completa con preguntas adicionales sobre raíces, familia, retos, logros y legado.':'Custom Song focuses on a moment, message, or occasion. A Life Corrido develops a full life journey with additional questions about roots, family, challenges, achievements, and legacy.',
    '¿El Corrido de una Vida tiene que ser sobre mí?':'Does A Life Corrido have to be about me?',
    'No. Puede ser sobre tu papá, mamá, pareja, abuelo, amigo, jefe o cualquier persona cuya historia quieras convertir en música.':'No. It can be about your parent, partner, grandparent, friend, boss, or anyone whose story you want to turn into music.',
    '¿Puedo pedir una revisión?':'Can I request a revision?',
    'Sí. Los productos que muestran una revisión incluida permiten ajustar la dirección dentro del alcance indicado antes de la entrega final.':'Yes. Products that include one revision allow you to adjust the direction within the stated scope before final delivery.',
    '¿Cómo se entrega?':'How is it delivered?',
    'La entrega es digital. Los tiempos y cualquier opción prioritaria se muestran antes de confirmar el pedido.':'Delivery is digital. Timing and any priority option are shown before you confirm the order.',
    '¿Los precios cambian entre Estados Unidos y México?':'Are prices different in the United States and Mexico?',
    'Sí. SONALZA utiliza precios regionales: Estados Unidos se cobra en USD y México en MXN. La región se verifica durante el proceso de pago.':'Yes. SONALZA uses regional pricing: United States orders are charged in USD and Mexico orders in MXN. Region is verified during payment.',
    '¿Necesitas ayuda con algo específico?':'Need help with something specific?',
    'Escríbenos a sonalzastudios@gmail.com':'Email us at sonalzastudios@gmail.com',
    'Privacidad':'Privacy',
    'Términos':'Terms',
    'Ayuda':'Help',
    'Política de privacidad':'Privacy policy',
    'Versión de lanzamiento. Debe revisarse legalmente antes de activar pagos reales.':'Launch version. It should be legally reviewed before real payments are enabled.',
    'Información que recopilamos':'Information we collect',
    'Podemos recopilar nombre, correo electrónico, teléfono opcional, información de la historia, preferencias musicales, región, idioma y archivos que decidas proporcionar para producir tu pedido.':'We may collect name, email address, optional phone number, story information, music preferences, region, language, and files you choose to provide for your order.',
    'Cómo usamos la información':'How we use information',
    'La usamos para preparar, administrar, entregar y dar soporte a tu pedido, prevenir fraude y mejorar la experiencia del servicio.':'We use it to prepare, manage, deliver, and support your order, prevent fraud, and improve the service experience.',
    'Historias y fotografías':'Stories and photos',
    'Las historias, fotografías y materiales que compartas se utilizan para prestar el servicio solicitado. No necesitas publicar tu historia para crear una canción.':'Stories, photos, and materials you share are used to provide the requested service. You do not need to publish your story to create a song.',
    'Proveedores':'Service providers',
    'Podemos utilizar proveedores especializados de hosting, base de datos, correo, almacenamiento y pagos. Solo reciben la información necesaria para prestar su función.':'We may use specialized hosting, database, email, storage, and payment providers. They receive only the information needed to perform their function.',
    'Contacto':'Contact',
    'Para preguntas de privacidad, escribe a':'For privacy questions, email',
    'Términos de servicio':'Terms of service',
    'Versión de lanzamiento. Los términos definitivos deben revisarse legalmente antes de aceptar pagos reales.':'Launch version. Final terms should be legally reviewed before accepting real payments.',
    'Servicio personalizado':'Custom service',
    'SONALZA crea piezas musicales a partir de la información y dirección que proporciona el cliente. El resultado creativo implica interpretación artística y no puede garantizar una reproducción literal de cada detalle.':'SONALZA creates musical pieces from the information and direction provided by the customer. The creative result involves artistic interpretation and cannot guarantee a literal reproduction of every detail.',
    'Revisiones':'Revisions',
    'Cuando un producto indique una revisión incluida, esta se aplica al alcance descrito en la oferta y no implica rehacer ilimitadamente una pieza desde cero.':'When a product includes one revision, it applies to the scope described in the offer and does not imply unlimited full remakes from scratch.',
    'Contenido proporcionado por el cliente':'Customer-provided content',
    'El cliente debe tener derecho a compartir las fotos, textos, nombres y demás materiales que proporcione para la producción.':'The customer must have the right to share any photos, text, names, and other materials provided for production.',
    'Pago y entrega':'Payment and delivery',
    'El precio, moneda, impuestos aplicables, tiempos y extras se muestran antes del cargo. La producción pagada se gestiona según la confirmación del pedido.':'Price, currency, applicable taxes, timing, and extras are shown before the charge. Paid production is handled according to the confirmed order.',
    'Uso de la canción':'Use of the song',
    'El alcance de uso personal o comercial debe corresponder al producto adquirido. Los proyectos para marcas pueden requerir condiciones de licencia específicas.':'Personal or commercial usage must match the product purchased. Brand projects may require specific licensing terms.',
    'Preguntas:':'Questions:',

    'se enfoca en un momento, mensaje u ocasión.':'focuses on a moment, message, or occasion.',
    'desarrolla una trayectoria completa y por eso hace preguntas adicionales sobre raíces, familia, retos, logros y legado.':'develops a complete life journey, so it asks additional questions about roots, family, challenges, achievements, and legacy.'
  });


  Object.assign(TEXT_EN, {
    'MÚSICA PERSONALIZADA · CREADA ALREDEDOR DE TU HISTORIA':'CUSTOM MUSIC · BUILT AROUND YOUR STORY',
    'Tu historia merece su propia canción.':'Your story deserves its own song.',
    'Hazla inolvidable.':'Make it unforgettable.',
    'Elige el estilo musical de tu historia.':'Choose the musical style for your story.',
    'Una canción sobre tu negocio, un hook para TikTok o Reels, un jingle para una campaña o música para reproducir en tu restaurante, tienda o evento.':'A song about your business, a TikTok or Reels hook, a campaign jingle, or music to play in your restaurant, store, or event.',
    'Una dedicatoria musical para una persona, ocasión o mensaje específico. Ideal para agradecer, celebrar, recordar, enamorar o sorprender.':'A musical dedication for a specific person, occasion, or message. Ideal for thanking, celebrating, remembering, expressing love, or surprising someone.',
    '2–3 minutos aprox.':'Approx. 2–3 minutes',
    'Una historia, mensaje u ocasión central':'One central story, message, or occasion',
    '1 ronda de revisión incluida':'1 revision round included',
    'Una producción narrativa premium para contar una trayectoria completa — tuya o de alguien más — con más profundidad, contexto y espacio para la historia.':'A premium narrative production for telling a complete life journey—yours or someone else’s—with more depth, context, and room for the story.',
    '3–6 minutos aprox.':'Approx. 3–6 minutes',
    'Formulario biográfico ampliado':'Expanded biographical brief',
    'Mayor profundidad lírica + proceso premium':'Deeper lyric development + premium process',
    'Música creada para vender, recordar o ambientar tu negocio: canciones de marca, hooks para redes, jingles para campañas y música para espacios físicos.':'Music created to sell, be remembered, or shape your business atmosphere: brand songs, social hooks, campaign jingles, and music for physical spaces.',
    'Canción que cuente la historia de tu negocio':'A song that tells your business story',
    'Hooks para TikTok, Reels o anuncios':'Hooks for TikTok, Reels, or ads',
    'Música para restaurante, tienda o evento':'Music for a restaurant, store, or event',
    'Licencia definida según el uso':'License defined by intended use',
    '¿Qué significa “1 revisión incluida”?':'What does “1 revision included” mean?',
    'Es una sola ronda consolidada de cambios después de recibir la primera versión. Debes enviarnos en esa misma revisión todos los ajustes que quieras solicitar. Cambios adicionales posteriores pueden tener costo extra. Los errores objetivos de SONALZA, como escribir mal un nombre que nos proporcionaste correctamente, no consumen tu revisión.':'It is one consolidated round of changes after you receive the first version. You should send all requested adjustments together in that revision. Additional later changes may cost extra. Objective SONALZA errors, such as misspelling a name you provided correctly, do not use your revision.',
    'Elige la experiencia que mejor encaje con lo que quieres contar. Después te guiamos una pregunta a la vez.':'Choose the experience that best fits what you want to tell. Then we guide you one question at a time.',
    'Una canción para decir algo que importa.':'A song for saying something that matters.',
    'Una canción breve y personalizada para agradecer, celebrar, recordar, dedicar o sorprender a alguien. Puede ser corrido, banda, cumbia, mariachi y más.':'A short personalized song to thank, celebrate, remember, dedicate, or surprise someone. It can be corrido, banda, cumbia, mariachi, and more.',
    '2–3 min de canción':'2–3 min song',
    'Una historia completa merece más profundidad.':'A complete life story deserves more depth.',
    'Una producción premium para contar una trayectoria completa con más contexto, detalle y profundidad.':'A premium production for telling a complete life journey with more context, detail, and depth.',
    '3–6 min de canción':'3–6 min song',
    'El protagonista puede ser tú o cualquier otra persona. El precio cambia por la profundidad, duración y alcance del proceso, no simplemente por elegir el género corrido.':'The main person can be you or anyone else. The price changes because of the depth, length, and scope of the process—not simply because you choose corrido as the genre.',
    'Privado · formulario 8–12 min':'Private · 8–12 min form',
    'Privado · formulario 3–5 min':'Private · 3–5 min form',
    'Duración aproximada':'Approximate length',
    'Elige entre 3 y 6 minutos. No cambia el precio. La duración final puede variar ligeramente según el ritmo y la estructura.':'Choose between 3 and 6 minutes. The price does not change. Final runtime may vary slightly based on tempo and structure.',
    'Una canción para tu negocio, un hook para redes o música para tu espacio.':'A song for your business, a social hook, or music for your space.',
    'Podemos crear desde una canción que cuente la historia de tu negocio hasta un hook para TikTok, un jingle de campaña o música para reproducir en tu restaurante, tienda, evento o contenido de marca.':'We can create anything from a song that tells your business story to a TikTok hook, a campaign jingle, or music for your restaurant, store, event, or branded content.',
    'Canción sobre tu negocio o su historia':'A song about your business or its story',
    'Hook para TikTok, Reels, Shorts o anuncios':'Hook for TikTok, Reels, Shorts, or ads',
    'Jingle para producto, campaña o promoción':'Jingle for a product, campaign, or promotion',
    'Música para restaurante, tienda, evento o experiencia de marca':'Music for a restaurant, store, event, or brand experience',
    '¿Tienes un cupón de descuento?':'Do you have a discount coupon?',
    'Escribe tu código':'Enter your code',
    'Aplicar':'Apply',
    'Descuento por cupón':'Coupon discount',
    'Incluye 1 revisión · ¿qué significa?':'Includes 1 revision · what does it mean?',
    'Recibe tu canción de forma privada y sencilla.':'Receive your song privately and easily.',
    'Una dedicatoria de 2–3 minutos centrada en un mensaje, recuerdo u ocasión. Si eliges “Corrido” como género, será una canción corta con estilo corrido,':'A 2–3 minute dedication centered on a message, memory, or occasion. If you choose “Corrido” as the genre, it will be a shorter corrido-style song,',
    'no una biografía completa':'not a full biography',
    'es una producción de 3–6 minutos con formulario ampliado, más contexto, mayor profundidad lírica y una narrativa de trayectoria.':'is a 3–6 minute production with an expanded brief, more context, deeper lyric development, and a life-journey narrative.',
    'Después de recibir la primera versión tienes':'After receiving the first version, you have',
    'una sola ronda de cambios':'one round of changes',
    'Envíanos todos los ajustes juntos y de forma específica. Una segunda ronda de cambios puede cotizarse aparte. Corregir un error objetivo de SONALZA no consume esa revisión.':'Send all requested adjustments together and be specific. A second round of changes may be quoted separately. Correcting an objective SONALZA error does not use that revision.',
    'Una sola ronda consolidada de cambios':'One consolidated round of changes',
    'El precio final, impuestos aplicables y método de pago se mostrarán claramente antes de cualquier cargo.':'The final price, applicable taxes, and payment method will be shown clearly before any charge.',
    'La Canción Personalizada es una dedicatoria de aproximadamente 2–3 minutos centrada en un mensaje, recuerdo u ocasión. Puede usar cualquier género, incluso corrido, pero no está diseñada como biografía completa. Corrido de una Vida es una producción de aproximadamente 3–6 minutos con formulario ampliado, más contexto, dirección regional mexicana y mayor profundidad narrativa.':'The Custom Song is an approximately 2–3 minute dedication centered on a message, memory, or occasion. It can use any genre, including corrido, but it is not designed as a full biography. A Life Corrido is an approximately 3–6 minute production with an expanded brief, more context, Regional Mexican direction, and deeper narrative development.',
    'Sí. “1 revisión incluida” significa una sola ronda consolidada de cambios después de la primera versión. Debes enviar todos tus ajustes juntos y de forma específica dentro del plazo indicado. Cambios adicionales posteriores pueden tener costo extra. Los errores objetivos de SONALZA se corrigen razonablemente sin consumir esa revisión.':'Yes. “1 revision included” means one consolidated round of changes after the first version. You should send all requested adjustments together and be specific within the stated revision period. Additional later changes may cost extra. Objective SONALZA errors are reasonably corrected without using that revision.',
    'Una producción premium para contar una trayectoria completa con más contexto, detalle y profundidad.':'A premium production for telling a complete life journey with more context, detail, and depth.',
    'Puede ser tu historia o la de alguien más.':'It can be your story or someone else’s.',
    'es una dedicatoria de 2–3 minutos centrada en un mensaje, recuerdo u ocasión. Si eliges “Corrido” como género, será una canción corta con estilo corrido,':'is a 2–3 minute dedication centered on a message, memory, or occasion. If you choose “Corrido” as the genre, it will be a shorter corrido-style song,',
    'es una producción de 3–6 minutos con formulario ampliado, más contexto, mayor profundidad lírica y una narrativa de trayectoria.':'is a 3–6 minute production with an expanded brief, more context, deeper lyric development, and a life-journey narrative.'
  });


  let storedRegion = localStorage.getItem(REGION_KEY);
  let detectedRegion = sessionStorage.getItem(DETECTED_REGION_KEY);
  detectedRegion = detectedRegion === 'MX' || detectedRegion === 'US' ? detectedRegion : null;
  let currentRegion = storedRegion === 'MX' ? 'MX' : 'US';
  let currentLanguage = localStorage.getItem(LANGUAGE_KEY) === 'es' ? 'es' : (localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : REGIONS[currentRegion].defaultLanguage);
  let currentCurrency = REGIONS[currentRegion].currency;

  const formatMoney = (amount, currency = currentCurrency) => {
    const value = Number(amount || 0).toLocaleString(currency === 'MXN' ? 'es-MX' : 'en-US', { maximumFractionDigits: 0 });
    return currency === 'MXN' ? `MX$${value}` : `US$${value}`;
  };


  Object.assign(TEXT_EN, {
    'Aviso de privacidad simplificado':'Privacy notice at collection',
    'Usaremos estos datos para evaluar tu proyecto, responderte, preparar una propuesta y prevenir fraude. No vendemos tu información personal.':'We use these details to evaluate your project, respond to you, prepare a proposal, and prevent fraud. We do not sell your personal information.',
    'Ver política completa →':'View full policy →',
    'Confirmo que leí y acepto los Términos y condiciones, incluyendo las reglas de revisiones, cancelaciones, licencias, propiedad intelectual y entrega.':'I confirm that I read and accept the Terms & Conditions, including the revision, cancellation, licensing, intellectual-property, and delivery rules.',
    'He leído y acepto la Política de privacidad y autorizo el tratamiento de mis datos para crear, administrar y entregar este pedido.':'I have read and accept the Privacy Policy and authorize processing of my data to create, administer, and deliver this order.',
    'Confirmo que tengo derecho o autorización para enviar la historia, nombres, fotos y demás materiales. Si incluyo voluntariamente datos personales sensibles sobre mí, otorgo consentimiento expreso para tratarlos únicamente en relación con este pedido; no enviaré datos sensibles de terceros sin autorización o base legal suficiente.':'I confirm that I have the rights or authorization to submit the story, names, photos, and other materials. If I voluntarily include sensitive personal information about myself, I expressly consent to processing it only in connection with this order; I will not submit sensitive third-party information without sufficient authorization or lawful basis.'
  });

  function translatePhrase(value) {
    if (currentLanguage !== 'en') return value;
    return TEXT_EN[value] || value;
  }

  function translateDOM(root = document.body) {
    document.documentElement.lang = currentLanguage;
    if (currentLanguage !== 'en') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement && ['SCRIPT','STYLE'].includes(node.parentElement.tagName)) return;
      const raw = node.nodeValue || '';
      const trimmed = raw.trim();
      if (!trimmed) return;
      let translated = TEXT_EN[trimmed];
      if (!translated) {
        let m = trimmed.match(/^¿Qué hace especial a (.+)\?$/);
        if (m) translated = `What makes ${m[1]} special?`;
        m = m || trimmed.match(/^Paso (\d+) de (\d+)$/);
        if (!translated && m && /^Paso/.test(trimmed)) translated = `Step ${m[1]} of ${m[2]}`;
        const pct = trimmed.match(/^(\d+)% completado$/);
        if (!translated && pct) translated = `${pct[1]}% complete`;
      }
      if (translated) node.nodeValue = raw.replace(trimmed, translated);
    });
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el => {
      ['placeholder','aria-label','title'].forEach(attr => {
        const value = el.getAttribute(attr);
        if (value && TEXT_EN[value]) el.setAttribute(attr, TEXT_EN[value]);
      });
    });
    const titles = {
      home:'SONALZA STUDIOS — Your story deserves its own song',
      create:'Create your song — SONALZA STUDIOS',
      order:'Review your order — SONALZA STUDIOS',
      business:'Jingles & brand music — SONALZA STUDIOS',
      thanks:'Order received — SONALZA STUDIOS'
    };
    if (titles[page]) document.title = titles[page];
    if (page === 'legal' && currentLanguage === 'en') {
      const heading = document.querySelector('h1')?.textContent.trim();
      if (heading === 'Frequently asked questions') document.title = 'FAQ — SONALZA STUDIOS';
      if (heading === 'Privacy policy') document.title = 'Privacy Policy — SONALZA STUDIOS';
      if (heading === 'Terms of service') document.title = 'Terms of Service — SONALZA STUDIOS';
    }
  }

  function syncBusinessBudgetOptions() {
    if (page !== 'business') return;
    const select = document.querySelector('select[name="budget"]');
    if (!select) return;
    const current = select.value;
    const options = currentRegion === 'MX'
      ? [['','Prefiero hablarlo'],['MX$4,999–9,999','MX$4,999–9,999'],['MX$10,000–25,000','MX$10,000–25,000'],['MX$25,000+','MX$25,000+']]
      : [['','Prefiero hablarlo'],['US$499–999','US$499–999'],['US$1,000–2,500','US$1,000–2,500'],['US$2,500+','US$2,500+']];
    select.innerHTML = options.map(([v,l]) => `<option value="${v}">${currentLanguage === 'en' && l === 'Prefiero hablarlo' ? 'I prefer to discuss it' : l}</option>`).join('');
    if ([...select.options].some(o=>o.value===current)) select.value=current;
  }

  function applyRegionalDisplay() {
    currentCurrency = REGIONS[currentRegion].currency;
    document.documentElement.dataset.region = currentRegion;
    document.documentElement.dataset.currency = currentCurrency;
    document.querySelectorAll('.price-value, .compare-price, .savings-value').forEach(el => {
      const raw = currentCurrency === 'MXN' ? el.dataset.mxn : el.dataset.usd;
      if (raw) el.textContent = formatMoney(raw);
    });
    document.querySelectorAll('.price-code').forEach(el => { el.textContent = currentCurrency; });
    document.querySelectorAll('[data-discount-usd]').forEach(el => {
      el.textContent = currentCurrency === 'MXN' ? el.dataset.discountMxn : el.dataset.discountUsd;
    });
    document.querySelectorAll('.region-only-currency').forEach(el => { el.textContent = currentCurrency; });
    syncBusinessBudgetOptions();
  }

  function localePickerMarkup(compact=false) {
    const region = REGIONS[currentRegion];
    const regionLabel = currentLanguage === 'en' ? region.labelEn : region.labelEs;
    const langCode = currentLanguage.toUpperCase();
    const countryTitle = currentLanguage === 'en' ? 'Purchase region' : 'Región de compra';
    const languageTitle = currentLanguage === 'en' ? 'Language' : 'Idioma';
    const detectedName = detectedRegion ? (currentLanguage === 'en' ? REGIONS[detectedRegion].labelEn : REGIONS[detectedRegion].labelEs) : null;
    const mismatch = Boolean(detectedRegion && currentRegion !== detectedRegion);
    const note = mismatch
      ? (currentLanguage === 'en' ? 'You selected a region different from the one detected. Billing country will be verified at checkout.' : 'Elegiste una región distinta a la detectada. El país de facturación se verificará al pagar.')
      : (currentLanguage === 'en' ? 'Your region sets the currency and regional price. You can change the site language freely.' : 'Tu región define la moneda y el precio regional. Puedes cambiar el idioma libremente.');
    const detectedCopy = detectedRegion
      ? (currentLanguage === 'en' ? `Detected from your connection: ${detectedName}` : `Detectado por tu conexión: ${detectedName}`)
      : (currentLanguage === 'en' ? 'We could not confirm your region automatically.' : 'No pudimos confirmar tu región automáticamente.');
    const detectedBadge = currentLanguage === 'en' ? 'Detected' : 'Detectado';
    return `<div class="locale-picker ${compact?'locale-picker-compact':''} ${mismatch?'region-mismatch':''}">
      <button type="button" class="locale-trigger" aria-haspopup="dialog" aria-expanded="false">
        <span class="locale-flag">${region.flag}</span><span class="locale-summary">${compact ? region.code : `${region.code} · ${langCode}`}</span><span class="locale-chevron">⌄</span>
      </button>
      <div class="locale-popover" role="dialog" aria-label="${countryTitle} / ${languageTitle}" aria-hidden="true">
        <div class="locale-pop-head"><strong>${currentLanguage === 'en' ? 'Region & language' : 'Región e idioma'}</strong><button type="button" class="locale-close" aria-label="${currentLanguage === 'en'?'Close':'Cerrar'}">×</button></div>
        <div class="geo-detected ${mismatch?'warn':''}"><span class="geo-dot"></span><div><strong>${detectedCopy}</strong><small>${currentLanguage === 'en' ? 'Regional prices are verified again when payment is enabled.' : 'Los precios regionales se verificarán nuevamente cuando se habilite el pago.'}</small></div></div>
        <div class="locale-group"><span class="locale-group-label">${countryTitle}</span>
          <button type="button" class="locale-choice ${currentRegion==='US'?'active':''}" data-region="US"><span>🇺🇸</span><div><strong>${currentLanguage==='en'?'United States':'Estados Unidos'}</strong><small>USD${detectedRegion==='US' ? ` · ${detectedBadge}` : ''}</small></div><i>✓</i></button>
          <button type="button" class="locale-choice ${currentRegion==='MX'?'active':''}" data-region="MX"><span>🇲🇽</span><div><strong>${currentLanguage==='en'?'Mexico':'México'}</strong><small>MXN${detectedRegion==='MX' ? ` · ${detectedBadge}` : ''}</small></div><i>✓</i></button>
        </div>
        <div class="locale-group"><span class="locale-group-label">${languageTitle}</span><div class="language-grid">
          <button type="button" class="language-choice ${currentLanguage==='es'?'active':''}" data-language="es"><strong>Español</strong><small>ES</small></button>
          <button type="button" class="language-choice ${currentLanguage==='en'?'active':''}" data-language="en"><strong>English</strong><small>EN</small></button>
        </div></div>
        <div class="locale-market-note ${mismatch?'warning':''}"><span>${mismatch?'!':'●'}</span><p><strong>${regionLabel} · ${currentCurrency}</strong><small>${note}</small></p></div>
      </div>
    </div>`;
  }

  function showRegionConfirmation(picker, region, onConfirm) {
    const popover = picker.querySelector('.locale-popover');
    popover.querySelector('.region-confirm-panel')?.remove();
    const target = REGIONS[region];
    const detected = detectedRegion ? REGIONS[detectedRegion] : null;
    const targetName = currentLanguage === 'en' ? target.labelEn : target.labelEs;
    const detectedName = detected ? (currentLanguage === 'en' ? detected.labelEn : detected.labelEs) : '';
    const panel = document.createElement('div');
    panel.className = 'region-confirm-panel';
    panel.innerHTML = `<div class="region-confirm-icon">◎</div><div class="region-confirm-copy"><strong>${currentLanguage === 'en' ? `Use ${targetName} pricing?` : `¿Usar precios de ${targetName}?`}</strong><p>${currentLanguage === 'en' ? `We detected ${detectedName}. Choose ${targetName} only if your billing country will be ${targetName}. The billing country will be verified at checkout.` : `Detectamos ${detectedName}. Elige ${targetName} solo si el país de facturación de tu método de pago será ${targetName}. Lo verificaremos al pagar.`}</p></div><div class="region-confirm-actions"><button type="button" class="region-confirm-cancel">${currentLanguage === 'en'?'Cancel':'Cancelar'}</button><button type="button" class="region-confirm-ok">${currentLanguage === 'en'?`Use ${target.code}`:`Usar ${target.code}`}</button></div>`;
    popover.appendChild(panel);
    panel.querySelector('.region-confirm-cancel').addEventListener('click', () => panel.remove());
    panel.querySelector('.region-confirm-ok').addEventListener('click', () => onConfirm());
  }

  function setRegionPreference(region, isOverride=false) {
    localStorage.setItem(REGION_KEY, region);
    localStorage.setItem(LANGUAGE_KEY, REGIONS[region].defaultLanguage);
    localStorage.setItem(PREF_KEY, '1');
    if (isOverride) localStorage.setItem(REGION_OVERRIDE_KEY, '1');
    else localStorage.removeItem(REGION_OVERRIDE_KEY);
    location.reload();
  }

  function bindLocalePicker(picker) {
    const trigger = picker.querySelector('.locale-trigger');
    const popover = picker.querySelector('.locale-popover');
    const close = picker.querySelector('.locale-close');
    const setOpen = open => {
      picker.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      popover.setAttribute('aria-hidden', open ? 'false' : 'true');
    };
    trigger.addEventListener('click', e => { e.stopPropagation(); setOpen(!picker.classList.contains('open')); });
    close?.addEventListener('click', () => setOpen(false));
    picker.querySelectorAll('[data-region]').forEach(btn => btn.addEventListener('click', () => {
      const region = btn.dataset.region === 'MX' ? 'MX' : 'US';
      if (region === currentRegion) return;
      if (detectedRegion && region !== detectedRegion) {
        showRegionConfirmation(picker, region, () => setRegionPreference(region, true));
        return;
      }
      setRegionPreference(region, false);
    }));
    picker.querySelectorAll('[data-language]').forEach(btn => btn.addEventListener('click', () => {
      const lang = btn.dataset.language === 'es' ? 'es' : 'en';
      localStorage.setItem(LANGUAGE_KEY, lang);
      localStorage.setItem(PREF_KEY, '1');
      location.reload();
    }));
    document.addEventListener('click', e => { if (!picker.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  async function getDetectedRegion() {
    if (detectedRegion) return detectedRegion;
    try {
      const r = await fetch('/api/geo', {cache:'no-store'});
      const data = await r.json();
      if (data && (data.country === 'US' || data.country === 'MX')) {
        detectedRegion = data.country;
        sessionStorage.setItem(DETECTED_REGION_KEY, detectedRegion);
        return detectedRegion;
      }
    } catch (_) {}
    return null;
  }

  async function setupLocalePicker() {
    await getDetectedRegion();
    const hasManualPreference = localStorage.getItem(PREF_KEY) === '1';
    if (!hasManualPreference && !storedRegion && detectedRegion) {
      currentRegion = detectedRegion;
      currentLanguage = REGIONS[detectedRegion].defaultLanguage;
      currentCurrency = REGIONS[detectedRegion].currency;
      localStorage.setItem(REGION_KEY, detectedRegion);
      localStorage.setItem(LANGUAGE_KEY, currentLanguage);
      storedRegion = detectedRegion;
    }
    const targets = [...document.querySelectorAll('.currency-switch')];
    targets.forEach((target,index) => {
      const holder = document.createElement('div');
      holder.innerHTML = localePickerMarkup(index>0);
      const picker = holder.firstElementChild;
      target.replaceWith(picker);
      bindLocalePicker(picker);
    });
    if (!targets.length) {
      const header = document.querySelector('.flow-header-inner');
      if (header) {
        const holder=document.createElement('div'); holder.innerHTML=localePickerMarkup(true); const picker=holder.firstElementChild;
        const exit=header.querySelector('.flow-exit'); if(exit) header.insertBefore(picker,exit); else header.appendChild(picker); bindLocalePicker(picker);
      }
    }
    applyRegionalDisplay();
    translateDOM(document.body);
    document.body.classList.add('locale-ready');
    window.dispatchEvent(new CustomEvent('sonalza:regionready', {detail:{region:currentRegion, detectedRegion, language:currentLanguage, currency:currentCurrency}}));
  }

  const defaultData = {
    product: 'song',
    paraQuien: '',
    nombre: '',
    ocasion: '',
    genero: '',
    voz: '',
    idioma: 'Español',
    cualidades: '',
    recuerdo: '',
    frase: '',
    emocion: '',
    email: '',
    telefono: '',
    coverPrompt: '',
    coverCropMustShow: '',
    coverImageName: '',
    coverImagePath: '',
    raices: '',
    trayectoria: '',
    personasClave: '',
    retos: '',
    logros: '',
    legado: '',
    duracion: ''
  };

  const load = () => {
    try { return { ...defaultData, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; }
    catch { return { ...defaultData }; }
  };
  const save = data => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  function setupExitIntent() {
    const modal = document.getElementById('exitModal');
    if (!modal) return;
    const close = document.getElementById('closeModal');
    let shown = false;
    const open = () => {
      if (shown) return;
      shown = true;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };
    const hide = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };
    document.addEventListener('mouseout', e => {
      if (e.clientY <= 0 && !e.relatedTarget) open();
    });
    close?.addEventListener('click', hide);
    modal.addEventListener('click', e => { if (e.target === modal) hide(); });
    modal.querySelectorAll('.reason').forEach(btn => {
      btn.addEventListener('click', () => {
        const payload = { reason: btn.dataset.reason, page: location.pathname, at: new Date().toISOString() };
        const previous = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
        previous.push(payload);
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(previous));
        fetch('/api/feedback', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...payload, region:currentRegion, language:currentLanguage, currency:currentCurrency})}).catch(()=>{});
        hide();
      });
    });
  }

  function setupRevealAnimations() {
    const selectors = [
      '.hero-copy', '.hero-media', '.trust-strip-grid > div', '.quick-head', '.quick-card', '.listen-head', '.listen-card',
      '.manifest-kicker', '.manifest-copy', '.manifest-points article', '.latin-copy', '.latin-side-note', '.latin-editorial-card', '.latin-values article',
      '.genre-heading-main', '.genre-heading-side', '.genre-tile', '.service-card', '.pricing-tools',
      '.process-intro', '.process-list article', '.standard-card', '.story-cta-copy', '.story-quote',
      '.footer-pro-brand', '.footer-pro-col', '.footer-pro-signature', '.flow-intro-bar', '.creative-rail', '.question-shell', '.order-hero', '.summary-card',
      '.business-intro', '.business-panel', '.business-form', '.thanks-card'
    ];
    const nodes = [...new Set(selectors.flatMap(sel => [...document.querySelectorAll(sel)]))].filter(Boolean);
    if (!nodes.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(el => { el.classList.add('reveal', 'is-visible'); });
      return;
    }
    nodes.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 65, 260)}ms`);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(el => io.observe(el));
  }

  function setupParallax() {
    const items = [...document.querySelectorAll('[data-parallax]')];
    if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(el => {
        const rect = el.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const center = rect.top + rect.height / 2;
        const delta = (center - vh / 2) / vh;
        const strength = Math.max(.02, Math.min(.18, Number(el.dataset.parallax || .08)));
        const y = Math.max(-16, Math.min(16, -delta * 120 * strength));
        el.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
      });
      ticking = false;
    };
    const request = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', request, { passive:true });
    window.addEventListener('resize', request);
    request();
  }

  if (page === 'home') {
    const sticky = document.getElementById('mobileCta');
    if (sticky) {
      const syncSticky = () => sticky.classList.toggle('visible', window.innerWidth <= 680 && window.scrollY > 520);
      window.addEventListener('scroll', syncSticky, { passive: true });
      window.addEventListener('resize', syncSticky);
      syncSticky();
    }
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (menuToggle && mobileNav) {
      const closeMenu = () => {
        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded','false');
        mobileNav.setAttribute('aria-hidden','true');
      };
      menuToggle.addEventListener('click', () => {
        const open = !mobileNav.classList.contains('open');
        mobileNav.classList.toggle('open', open);
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      });
      mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
    }
  }

  if (page === 'create') {
    const data = load();
    if (data.voz === 'Masculina') data.voz = 'ALTUNO';
    if (data.voz === 'Femenina') data.voz = 'NARELI';
    const params = new URLSearchParams(location.search);
    const productParam = params.get('product');
    const genreParam = params.get('genre');
    const occasionParam = params.get('occasion');
    const relationParam = params.get('relation');
    const explicitProduct = productParam === 'song' || productParam === 'corrido';

    if (productParam === 'corrido') { data.product = 'corrido'; data.genero = data.genero || 'Corrido clásico'; }
    else if (productParam === 'song') data.product = 'song';
    if (genreParam) data.genero = genreParam.slice(0,80);
    if (occasionParam) data.ocasion = occasionParam.slice(0,80);
    if (relationParam) data.paraQuien = relationParam.slice(0,80);
    save(data);

    let step = 0;
    const question = document.getElementById('question');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const stepLabel = document.getElementById('stepLabel');
    const pctLabel = document.getElementById('pctLabel');
    const bar = document.getElementById('bar');
    const railTipTitle = document.getElementById('railTipTitle');
    const railTipText = document.getElementById('railTipText');
    const productChooser = document.getElementById('productChooser');
    const songFlow = document.getElementById('songFlow');
    const productChoiceButtons = [...document.querySelectorAll('[data-product-choice]')];
    const selectedProductSummary = document.getElementById('selectedProductSummary');
    const flowDurationMeta = document.getElementById('flowDurationMeta');
    const changeProductBtn = document.getElementById('changeProductBtn');

    const t = (es,en) => currentLanguage === 'en' ? en : es;
    const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    const productName = key => key === 'corrido' ? t('Corrido de una Vida','A Life Corrido') : t('Canción Personalizada','Custom Song');
    const productPrice = key => formatMoney(PRICING[key][currentCurrency]);

    function syncProductChoiceUI() {
      productChoiceButtons.forEach(btn => btn.classList.toggle('selected', btn.dataset.productChoice === data.product));
      if (selectedProductSummary) selectedProductSummary.textContent = `${productName(data.product)} · ${productPrice(data.product)}`;
      if (flowDurationMeta) flowDurationMeta.textContent = data.product === 'corrido' ? t('Privado · formulario 8–12 min','Private · 8–12 min form') : t('Privado · formulario 3–5 min','Private · 3–5 min form');
      const railFormTime = document.getElementById('railFormTime');
      if (railFormTime) railFormTime.textContent = data.product === 'corrido' ? t('8–12 minutos','8–12 minutes') : t('3–5 minutos','3–5 minutes');
    }

    function showProductChooser() {
      if (songFlow) songFlow.hidden = true;
      if (productChooser) productChooser.hidden = false;
      syncProductChoiceUI();
      window.scrollTo({top:0,behavior:'smooth'});
    }

    function startSelectedProduct(key, {scroll=true}={}) {
      data.product = key === 'corrido' ? 'corrido' : 'song';
      const corridoGenres = ['Corrido clásico','Corrido moderno','Norteño-corrido','Sierreño-corrido','Sorpréndeme'];
      const songGenres = ['Corrido','Banda','Norteño','Cumbia','Mariachi','Duranguense','Huapango','Sierreño','Pop Latino','Reguetón','Balada','Sorpréndeme'];
      if (data.product === 'corrido' && !corridoGenres.includes(data.genero)) data.genero = 'Corrido clásico';
      if (data.product === 'song' && !songGenres.includes(data.genero)) data.genero = 'Corrido';
      if (data.product === 'song') data.duracion = '2–3 min';
      if (data.product === 'corrido' && !['3 min','4 min','5 min','6 min'].includes(data.duracion)) data.duracion = '';
      save(data);
      syncProductChoiceUI();
      if (productChooser) productChooser.hidden = true;
      if (songFlow) songFlow.hidden = false;
      step = 0;
      render();
      if (scroll) window.scrollTo({top:0,behavior:'smooth'});
    }

    productChoiceButtons.forEach(btn => btn.addEventListener('click', () => startSelectedProduct(btn.dataset.productChoice)));
    changeProductBtn?.addEventListener('click', showProductChooser);
    window.addEventListener('sonalza:regionready', () => { syncProductChoiceUI(); if (songFlow && !songFlow.hidden) render(); });

    function optionButtons(items, selected, key, columns='') {
      const cls = columns ? ` option-grid-${columns}` : '';
      return `<div class="option-grid${cls}">${items.map(item => {
        const obj = typeof item === 'string' ? {value:item,label:item} : item;
        const label = obj.labelEn && currentLanguage === 'en' ? obj.labelEn : (obj.labelEs || translatePhrase(obj.label || obj.value));
        return `<button type="button" class="option ${selected === obj.value ? 'selected' : ''}" data-key="${key}" data-value="${escapeHtml(obj.value)}">${escapeHtml(label)}</button>`;
      }).join('')}</div>`;
    }


    function voiceArtistSelector(selected='') {
      const artists = [
        {
          value:'ALTUNO',
          roleEs:'Voz masculina', roleEn:'Male voice',
          sample:'https://youtu.be/oV1TDEEhi50?si=G9jcFA0RxSMREMq0&t=12',
          sampleEs:'Escuchar ALTUNO', sampleEn:'Listen to ALTUNO'
        },
        {
          value:'NARELI',
          roleEs:'Voz femenina', roleEn:'Female voice',
          sample:'https://youtu.be/kaLsmAUMohg?si=2b6fUHyjD8bklytB&t=57',
          sampleEs:'Escuchar NARELI', sampleEn:'Listen to NARELI'
        },
        {
          value:'Sorpréndeme',
          roleEs:'SONALZA elige la voz que mejor combine con tu historia.',
          roleEn:'SONALZA chooses the voice that best fits your story.'
        }
      ];
      return `<div class="voice-artist-grid">${artists.map(artist => {
        const isSelected = selected === artist.value;
        const role = currentLanguage === 'en' ? artist.roleEn : artist.roleEs;
        const chooseLabel = currentLanguage === 'en' ? `Choose ${artist.value === 'Sorpréndeme' ? 'Surprise me' : artist.value}` : `Elegir ${artist.value}`;
        const displayName = artist.value === 'Sorpréndeme' && currentLanguage === 'en' ? 'SURPRISE ME' : artist.value.toUpperCase();
        const sample = artist.sample ? `<a class="voice-sample" href="${artist.sample}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(currentLanguage === 'en' ? artist.sampleEn : artist.sampleEs)}"><span class="voice-sample-play" aria-hidden="true">▶</span><span>${escapeHtml(currentLanguage === 'en' ? artist.sampleEn : artist.sampleEs)}</span></a>` : `<span class="voice-sample voice-sample-muted"><span class="voice-sample-spark" aria-hidden="true">✦</span><span>${escapeHtml(currentLanguage === 'en' ? 'SONALZA chooses' : 'SONALZA elige')}</span></span>`;
        return `<div class="voice-artist-card ${isSelected ? 'selected' : ''}" data-voice-card="${escapeHtml(artist.value)}">
          <button type="button" class="voice-select" data-voice-choice="${escapeHtml(artist.value)}" aria-pressed="${isSelected ? 'true' : 'false'}" aria-label="${escapeHtml(chooseLabel)}">
            <span class="voice-card-top"><strong>${escapeHtml(displayName)}</strong><span class="voice-check" aria-hidden="true">✓</span></span>
            <span class="voice-role">${escapeHtml(role)}</span>
          </button>
          ${sample}
        </div>`;
      }).join('')}</div>`;
    }

    const relationOptions = ['Esposo','Esposa','Pareja','Novio','Novia','Papá','Mamá','Hijo','Hija','Abuelo/a','Hermano/a','Amigo/a','Para mí','Otro'];
    const songOccasions = ['Porque sí','Te amo','Cumpleaños','Aniversario','Te extraño','Gracias','Perdón','Boda','Amistad','En memoria','Logro especial','Propuesta','Jubilación','Graduación','Otra ocasión'];
    const lifeOccasions = [
      {value:'Homenaje',labelEs:'Homenaje',labelEn:'Tribute'},
      {value:'Cumpleaños',labelEs:'Cumpleaños',labelEn:'Birthday'},
      {value:'En memoria',labelEs:'En memoria',labelEn:'In memory'},
      {value:'Jubilación',labelEs:'Jubilación',labelEn:'Retirement'},
      {value:'Legado familiar',labelEs:'Legado familiar',labelEn:'Family legacy'},
      {value:'Regalo especial',labelEs:'Regalo especial',labelEn:'Special gift'},
      {value:'Porque su historia merece contarse',labelEs:'Porque su historia merece contarse',labelEn:'Because their story deserves to be told'},
      {value:'Otra ocasión',labelEs:'Otra ocasión',labelEn:'Another occasion'}
    ];

    const songSteps = [
      () => `
        <div class="smallcaps">${t('Paso 1','Step 1')}</div>
        <h1>${t('¿Para quién es esta canción?','Who is this song for?')}</h1>
        <p class="sub">${t('Elige la relación más cercana. Si no aparece exactamente, selecciona “Otro”.','Choose the closest relationship. If it is not listed, select “Other.”')}</p>
        <div class="why-box"><strong>${t('¿Por qué te lo preguntamos?','Why do we ask?')}</strong><span>${t('La relación cambia el tono de la letra y la forma de contar la historia.','The relationship changes the tone and how the story is told.')}</span></div>
        ${optionButtons(relationOptions, data.paraQuien, 'paraQuien')}`,
      () => `
        <div class="smallcaps">${t('Paso 2','Step 2')}</div>
        <h1>${t('¿Cómo se llama?','What is their name?')}</h1>
        <p class="sub">${t('Escribe el nombre tal como quieres que aparezca o se cante.','Enter the name exactly as you want it written or sung.')}</p>
        <div class="why-box"><strong>${t('Ejemplo','Example')}</strong><span>${t('“José”, “Mamá Lupita”, “Mi viejo”, “César”. Usa la forma que realmente le dices.','“José,” “Mamá Lupita,” “Mi viejo,” “César.” Use the name you actually call them.')}</span></div>
        <div class="form-box"><label for="nombre">${t('Nombre','Name')}</label><input id="nombre" maxlength="60" placeholder="${t('Ejemplo: Julián','Example: Julian')}" value="${escapeHtml(data.nombre)}"><div class="field-meta"><span>${t('Así lo usaremos dentro de la canción.','This is how we will use it in the song.')}</span><span id="nombreCount">${data.nombre.length}/60</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 3','Step 3')}</div>
        <h1>${t('¿Cuál es la ocasión?','What is the occasion?')}</h1>
        <p class="sub">${t('Elige la ocasión que mejor explica por qué estás creando esta canción.','Choose the occasion that best explains why you are creating this song.')}</p>
        ${optionButtons(songOccasions, data.ocasion, 'ocasion')}`,
      () => `
        <div class="smallcaps">${t('Paso 4','Step 4')}</div>
        <h1>${t('Elige el estilo de la canción','Choose the musical style')}</h1>
        <p class="sub">${t('Piensa en la persona que la recibirá. El género cambia por completo la emoción.','Think about the person receiving it. The genre completely changes the emotion.')}</p>
        ${optionButtons(['Corrido','Banda','Norteño','Cumbia','Mariachi','Duranguense','Huapango','Sierreño','Pop Latino','Reguetón','Balada','Sorpréndeme'], data.genero, 'genero')}
        <div class="dual-grid music-settings">
          <div class="music-setting voice-setting">
            <div class="voice-section-head"><div><div class="helper setting-label">${t('Voz de tu canción','Voice for your song')}</div><strong>${t('¿Quién quieres que interprete tu canción?','Who would you like to perform your song?')}</strong></div><span>${t('Escucha una muestra antes de elegir.','Listen to a sample before choosing.')}</span></div>
            ${voiceArtistSelector(data.voz)}
            <p class="voice-disclaimer">${t('La interpretación final puede variar según el género, tono y producción de tu canción.','The final performance may vary depending on the genre, tone, and production of your song.')}</p>
          </div>
          <div class="music-setting language-setting"><div class="helper setting-label">${t('Idioma de la canción','Song language')}</div>${optionButtons(['Español','Inglés','Bilingüe'], data.idioma, 'idioma')}</div>
        </div>`,
      () => `
        <div class="smallcaps">${t('Paso 5','Step 5')}</div>
        <h1>${t(`¿Qué hace especial a ${escapeHtml(data.nombre) || 'esta persona'}?`,`What makes ${escapeHtml(data.nombre) || 'this person'} special?`)}</h1>
        <p class="sub">${t('Descríbela con tus propias palabras. Una o dos frases claras suelen dar mejores resultados.','Describe them in your own words. One or two clear sentences often work best.')}</p>
        <div class="prompt-chips"><span>${t('Cómo es','Personality')}</span><span>${t('Qué admiras','What you admire')}</span><span>${t('Qué hace por ustedes','What they do for you')}</span></div>
        <div class="form-box"><label for="cualidades">${t('Sus mejores cualidades','Their best qualities')}</label><textarea id="cualidades" maxlength="700" placeholder="${t('Ejemplo: Siempre ha cuidado de nuestra familia, tiene un gran sentido del humor y nunca deja que nadie se rinda.','Example: They have always taken care of our family, have a great sense of humor, and never let anyone give up.')}">${escapeHtml(data.cualidades)}</textarea><div class="field-meta"><span>${t('Escribe natural. No necesitas rimar.','Write naturally. You do not need to rhyme.')}</span><span id="cualidadesCount">${data.cualidades.length}/700</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 6','Step 6')}</div>
        <h1>${t('Comparte un recuerdo inolvidable','Share a favorite memory')}</h1>
        <p class="sub">${t('Los detalles específicos hacen que la canción se sienta verdaderamente personal.','Specific details are what make the song feel genuinely personal.')}</p>
        <div class="prompt-chips"><span>${t('Un lugar','A place')}</span><span>${t('Una anécdota','A story')}</span><span>${t('Una frase','A phrase')}</span><span>${t('Un momento','A moment')}</span></div>
        <div class="form-box"><label for="recuerdo">${t('Momento especial','Special moment')}</label><textarea id="recuerdo" maxlength="900" placeholder="${t('Ejemplo: Nos conocimos trabajando en Anaheim. Siempre dice “primero la familia”. El viaje a Chihuahua en 2018 fue cuando…','Example: We met while working in Anaheim. They always say “family first.” The trip to Chihuahua in 2018 was when…')}">${escapeHtml(data.recuerdo)}</textarea><div class="field-meta"><span>${t('Entre más específico, menos genérica se sentirá la canción.','The more specific you are, the less generic the song will feel.')}</span><span id="recuerdoCount">${data.recuerdo.length}/900</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 7','Step 7')}</div>
        <h1>${t('¿Qué quieres que sienta al escucharla?','What do you want them to feel?')}</h1>
        <p class="sub">${t('Dinos el mensaje que debe quedar en el corazón de quien la reciba.','Tell us the message you want to stay with them after the song ends.')}</p>
        <div class="dual-grid">
          <div class="form-box"><label for="frase">${t('Frase que te gustaría escuchar','A phrase you would like included')} <span class="helper">(${t('opcional','optional')})</span></label><textarea id="frase" maxlength="300" placeholder="${t('Ejemplo: Gracias por cruzar fronteras por nosotros.','Example: Thank you for crossing borders for us.')}">${escapeHtml(data.frase)}</textarea><div class="field-meta"><span>${t('Puede ser una frase familiar o algo que tú quieres decirle.','It can be a family phrase or something you want to tell them.')}</span><span id="fraseCount">${data.frase.length}/300</span></div></div>
          <div class="form-box"><label for="emocion">${t('Mensaje principal','Main message')}</label><textarea id="emocion" maxlength="700" placeholder="${t('Ejemplo: Quiero que entienda que todo su esfuerzo valió la pena y que estamos orgullosos de él.','Example: I want him to know that all his effort was worth it and that we are proud of him.')}">${escapeHtml(data.emocion)}</textarea><div class="field-meta"><span>${t('Piensa en cómo quieres que se sienta al terminar.','Think about how you want them to feel when it ends.')}</span><span id="emocionCount">${data.emocion.length}/700</span></div></div>
        </div>`,
      contactStep
    ];

    const corridoSteps = [
      () => `
        <div class="smallcaps">${t('Paso 1','Step 1')}</div>
        <h1>${t('¿De quién vamos a contar la vida?','Whose life story are we telling?')}</h1>
        <p class="sub">${t('Puede ser tu historia o la de alguien más. Elige la relación que tienes con el protagonista.','It can be your story or someone else’s. Choose your relationship to the person at the center of the story.')}</p>
        ${optionButtons(relationOptions, data.paraQuien, 'paraQuien')}`,
      () => `
        <div class="smallcaps">${t('Paso 2','Step 2')}</div>
        <h1>${t('¿Cómo se llama el protagonista?','What is the main person’s name?')}</h1>
        <p class="sub">${t('Escribe el nombre o apodo tal como quieres que aparezca en la historia.','Enter the name or nickname exactly as you want it to appear in the story.')}</p>
        <div class="form-box"><label for="nombre">${t('Nombre','Name')}</label><input id="nombre" maxlength="60" placeholder="${t('Ejemplo: Don Julián','Example: Don Julian')}" value="${escapeHtml(data.nombre)}"><div class="field-meta"><span>${t('Usa la forma en que la familia realmente le llama.','Use the name the family actually calls them.')}</span><span id="nombreCount">${data.nombre.length}/60</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 3','Step 3')}</div>
        <h1>${t('¿Por qué quieres contar esta historia?','Why do you want to tell this story?')}</h1>
        <p class="sub">${t('La intención nos ayuda a decidir qué momentos deben tener más peso.','Your reason helps us decide which parts of the story should carry the most weight.')}</p>
        ${optionButtons(lifeOccasions, data.ocasion, 'ocasion', '2')}`,
      () => `
        <div class="smallcaps">${t('Paso 4','Step 4')}</div>
        <h1>${t('¿De dónde viene su historia?','Where does their story begin?')}</h1>
        <p class="sub">${t('Cuéntanos sus raíces: lugar de origen, familia, infancia o aquello que marcó sus primeros años.','Tell us about their roots: where they are from, family background, childhood, or what shaped their early years.')}</p>
        <div class="form-box"><label for="raices">${t('Raíces e infancia','Roots and early years')}</label><textarea id="raices" maxlength="1200" placeholder="${t('Ejemplo: Nació en Delicias, Chihuahua. Creció con seis hermanos y desde joven ayudaba a su papá en el campo…','Example: Born in Delicias, Chihuahua. Grew up with six siblings and helped his father in the fields from a young age…')}">${escapeHtml(data.raices)}</textarea><div class="field-meta"><span>${t('Lugar, familia, costumbres y recuerdos de origen ayudan muchísimo.','Places, family, traditions, and early memories are extremely useful.')}</span><span id="raicesCount">${data.raices.length}/1200</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 5','Step 5')}</div>
        <h1>${t('¿Cómo fue construyendo su camino?','How did they build their path?')}</h1>
        <p class="sub">${t('Trabajo, oficios, migración, ciudades, negocios, sacrificios o decisiones que cambiaron su vida.','Work, trades, migration, cities, businesses, sacrifices, or decisions that changed their life.')}</p>
        <div class="form-box"><label for="trayectoria">${t('Trayectoria','Life journey')}</label><textarea id="trayectoria" maxlength="1500" placeholder="${t('Ejemplo: Llegó a California con poco dinero, trabajó en construcción, después abrió su propio negocio y nunca dejó de ayudar a su familia en México…','Example: Arrived in California with little money, worked construction, later opened a business, and never stopped helping family in Mexico…')}">${escapeHtml(data.trayectoria)}</textarea><div class="field-meta"><span>${t('No necesitas escribir bonito; danos los hechos y nosotros encontramos la narrativa.','You do not need polished writing; give us the facts and we will shape the narrative.')}</span><span id="trayectoriaCount">${data.trayectoria.length}/1500</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 6','Step 6')}</div>
        <h1>${t('¿Quiénes son parte importante de su historia?','Who matters most in their story?')}</h1>
        <p class="sub">${t('Familia, pareja, hijos, amigos, mentores o personas que no deberían faltar.','Family, partner, children, friends, mentors, or anyone who should not be left out.')}</p>
        <div class="form-box"><label for="personasClave">${t('Personas y vínculos clave','Key people and relationships')}</label><textarea id="personasClave" maxlength="1200" placeholder="${t('Ejemplo: Su esposa Rosa estuvo con él desde el principio. Sus hijos Ana y Luis son su mayor orgullo…','Example: His wife Rosa has been with him from the beginning. His children Ana and Luis are his greatest pride…')}">${escapeHtml(data.personasClave)}</textarea><div class="field-meta"><span>${t('Incluye nombres si quieres escucharlos dentro de la canción.','Include names if you may want them mentioned in the song.')}</span><span id="personasClaveCount">${data.personasClave.length}/1200</span></div></div>`,
      () => `
        <div class="smallcaps">${t('Paso 7','Step 7')}</div>
        <h1>${t('Los momentos que lo pusieron a prueba y los que lo hicieron grande.','The moments that tested them—and the ones that made them proud.')}</h1>
        <div class="dual-grid">
          <div class="form-box"><label for="retos">${t('Retos y sacrificios','Challenges and sacrifices')}</label><textarea id="retos" maxlength="1000" placeholder="${t('Momentos difíciles, pérdidas, obstáculos, empezar de cero, decisiones duras…','Hard moments, losses, obstacles, starting over, difficult decisions…')}">${escapeHtml(data.retos)}</textarea><div class="field-meta"><span>${t('Puedes omitir cualquier tema que no quieras mencionar.','You can leave out anything you do not want mentioned.')}</span><span id="retosCount">${data.retos.length}/1000</span></div></div>
          <div class="form-box"><label for="logros">${t('Logros y momentos de orgullo','Achievements and proud moments')}</label><textarea id="logros" maxlength="1000" placeholder="${t('Familia, negocio, casa, carrera, estudios, ayudar a otros, metas cumplidas…','Family, business, home, career, education, helping others, goals achieved…')}">${escapeHtml(data.logros)}</textarea><div class="field-meta"><span>${t('No tienen que ser premios; también cuentan las victorias personales.','They do not have to be awards; personal victories count too.')}</span><span id="logrosCount">${data.logros.length}/1000</span></div></div>
        </div>`,
      () => `
        <div class="smallcaps">${t('Paso 8','Step 8')}</div>
        <h1>${t('¿Cómo es esa persona de verdad?','What are they really like?')}</h1>
        <p class="sub">${t('Personalidad, valores, sentido del humor, costumbres y una frase que todos le reconocen.','Personality, values, humor, habits, and a phrase everyone associates with them.')}</p>
        <div class="dual-grid">
          <div class="form-box"><label for="cualidades">${t('Personalidad y valores','Personality and values')}</label><textarea id="cualidades" maxlength="900" placeholder="${t('Ejemplo: Trabajador, bromista, protector, terco para rendirse y siempre pone a la familia primero.','Example: Hard-working, funny, protective, too stubborn to quit, and always puts family first.')}">${escapeHtml(data.cualidades)}</textarea><div class="field-meta"><span>${t('Escribe como tú lo describirías en una conversación.','Write it the way you would describe them in a conversation.')}</span><span id="cualidadesCount">${data.cualidades.length}/900</span></div></div>
          <div class="form-box"><label for="frase">${t('Frase, dicho o expresión','Phrase, saying, or expression')} <span class="helper">(${t('opcional','optional')})</span></label><textarea id="frase" maxlength="400" placeholder="${t('Ejemplo: “Primero la familia” o “Si vas a hacer algo, hazlo bien”.','Example: “Family first” or “If you are going to do something, do it right.”')}">${escapeHtml(data.frase)}</textarea><div class="field-meta"><span>${t('Una frase auténtica puede convertirse en uno de los momentos más memorables.','A real phrase can become one of the most memorable moments.')}</span><span id="fraseCount">${data.frase.length}/400</span></div></div>
        </div>`,
      () => `
        <div class="smallcaps">${t('Paso 9','Step 9')}</div>
        <h1>${t('¿Qué legado quieres que quede al final?','What legacy should remain at the end?')}</h1>
        <p class="sub">${t('Dinos qué significa su vida para ustedes y qué quieres que sienta cuando termine la canción.','Tell us what their life means to you and what you want them to feel when the song ends.')}</p>
        <div class="dual-grid">
          <div class="form-box"><label for="legado">${t('Legado','Legacy')}</label><textarea id="legado" maxlength="1000" placeholder="${t('Ejemplo: Nos enseñó que se puede empezar desde cero sin olvidar de dónde venimos.','Example: He taught us that you can start from zero without forgetting where you came from.')}">${escapeHtml(data.legado)}</textarea><div class="field-meta"><span>${t('Piensa en lo que esa vida dejó en otras personas.','Think about what this life has left in other people.')}</span><span id="legadoCount">${data.legado.length}/1000</span></div></div>
          <div class="form-box"><label for="emocion">${t('Mensaje final','Final message')}</label><textarea id="emocion" maxlength="900" placeholder="${t('Ejemplo: Quiero que se sienta orgulloso y que sepa que todo su esfuerzo valió la pena.','Example: I want him to feel proud and know that all his effort was worth it.')}">${escapeHtml(data.emocion)}</textarea><div class="field-meta"><span>${t('Esto nos ayuda a cerrar la historia con intención.','This helps us close the story with intention.')}</span><span id="emocionCount">${data.emocion.length}/900</span></div></div>
        </div>`,
      () => `
        <div class="smallcaps">${t('Paso 10','Step 10')}</div>
        <h1>${t('Elige la dirección del corrido','Choose the corrido direction')}</h1>
        <p class="sub">${t('La historia es la misma; aquí decides cómo quieres que se sienta musicalmente.','The story stays the same; here you choose how you want it to feel musically.')}</p>
        ${optionButtons([
          {value:'Corrido clásico',labelEs:'Corrido clásico',labelEn:'Classic corrido'},
          {value:'Corrido moderno',labelEs:'Corrido moderno',labelEn:'Modern corrido'},
          {value:'Norteño-corrido',labelEs:'Norteño-corrido',labelEn:'Norteño-corrido'},
          {value:'Sierreño-corrido',labelEs:'Sierreño-corrido',labelEn:'Sierreño-corrido'},
          {value:'Sorpréndeme',labelEs:'Sorpréndeme',labelEn:'Surprise me'}
        ], data.genero, 'genero')}
        <div class="dual-grid music-settings">
          <div class="music-setting voice-setting">
            <div class="voice-section-head"><div><div class="helper setting-label">${t('Voz de tu canción','Voice for your song')}</div><strong>${t('¿Quién quieres que interprete tu canción?','Who would you like to perform your song?')}</strong></div><span>${t('Escucha una muestra antes de elegir.','Listen to a sample before choosing.')}</span></div>
            ${voiceArtistSelector(data.voz)}
            <p class="voice-disclaimer">${t('La interpretación final puede variar según el género, tono y producción de tu canción.','The final performance may vary depending on the genre, tone, and production of your song.')}</p>
          </div>
          <div class="music-setting language-setting"><div class="helper setting-label">${t('Idioma de la canción','Song language')}</div>${optionButtons(['Español','Inglés','Bilingüe'], data.idioma, 'idioma')}</div>
        </div>
        <div class="duration-selector">
          <div class="helper setting-label">${t('Duración aproximada','Approximate length')}</div>
          <p class="duration-note">${t('Elige entre 3 y 6 minutos. No cambia el precio. La duración final puede variar ligeramente según el ritmo y la estructura.','Choose between 3 and 6 minutes. The price does not change. Final runtime may vary slightly based on tempo and structure.')}</p>
          ${optionButtons(['3 min','4 min','5 min','6 min'], data.duracion, 'duracion', '4')}
        </div>`,
      contactStep
    ];

    function contactStep() {
      const phonePlaceholder = currentRegion === 'MX' ? '614 123 4567' : '(714) 555-1234';
      return `
        <div class="smallcaps">${t('Paso final','Final step')}</div>
        <h1>${t('¿A dónde enviamos tu canción?','Where should we send your song?')}</h1>
        <p class="sub">${t('Usaremos estos datos para identificar tu pedido y comunicarnos contigo sobre la entrega.','We use these details to identify your order and contact you about delivery.')}</p>
        <div class="privacy-note"><span>🔒</span><div><strong>${t('Tu historia es privada.','Your story is private.')}</strong><p>${t('No necesitas publicar nada para crear tu canción.','You do not need to publish anything to create your song.')}</p></div></div>
        <div class="notice-at-collection"><strong>${t('Aviso de privacidad simplificado','Privacy notice at collection')}</strong><span>${t('Usaremos tus datos de contacto, historia y archivos únicamente para preparar, administrar y entregar tu pedido, prevenir fraude y cumplir obligaciones legales. No vendemos tu información personal.','We use your contact details, story, and files only to create, administer, and deliver your order, prevent fraud, and comply with legal obligations. We do not sell your personal information.')}</span><a href="privacy.html" target="_blank" rel="noopener">${t('Ver política completa','View full policy')} →</a></div>
        <div class="dual-grid contact-grid">
          <div class="form-box compact-field" id="emailField"><label for="email">${t('Correo electrónico','Email address')}</label><input type="email" id="email" inputmode="email" autocomplete="email" placeholder="${t('tu@correo.com','you@email.com')}" value="${escapeHtml(data.email)}"><div id="emailValidation" class="field-validation" hidden></div></div>
          <div class="form-box compact-field"><label for="telefono">${t('Teléfono','Phone')} <span class="helper">(${t('opcional','optional')})</span></label><input id="telefono" inputmode="tel" autocomplete="tel" placeholder="${phonePlaceholder}" value="${escapeHtml(data.telefono)}"><div class="helper">${t('Solo lo usaríamos para avisos importantes de entrega.','We would only use it for important delivery updates.')}</div></div>
        </div>`;
    }

    function getSteps() { return data.product === 'corrido' ? corridoSteps : songSteps; }

    function bindVoiceArtistSelector() {
      question.querySelectorAll('[data-voice-choice]').forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.voiceChoice || '';
          data.voz = value;
          save(data);
          question.querySelectorAll('[data-voice-card]').forEach(card => {
            const active = card.dataset.voiceCard === value;
            card.classList.toggle('selected', active);
            const select = card.querySelector('[data-voice-choice]');
            if (select) select.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
        });
      });
      // Sample links are separate interactive elements by design; clicking them must never select a voice.
      question.querySelectorAll('.voice-sample').forEach(link => link.addEventListener('click', e => e.stopPropagation()));
    }

    function bindOptions() {
      question.querySelectorAll('.option').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          const value = btn.dataset.value;
          data[key] = value;
          save(data);
          question.querySelectorAll(`.option[data-key="${key}"]`).forEach(x => x.classList.toggle('selected', x === btn));
        });
      });
    }

    function collectInputs() {
      const ids = ['nombre','cualidades','recuerdo','frase','emocion','email','telefono','raices','trayectoria','personasClave','retos','logros','legado'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value.trim();
      });
      save(data);
    }

    const EMAIL_DOMAIN_FIXES = {
      'gmil.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmal.com':'gmail.com','gnail.com':'gmail.com',
      'hotnail.com':'hotmail.com','hotmai.com':'hotmail.com','hotmail.co':'hotmail.com','outlok.com':'outlook.com','outloo.com':'outlook.com',
      'icloud.co':'icloud.com','iclod.com':'icloud.com','yaho.com':'yahoo.com','yahoo.co':'yahoo.com'
    };

    function getEmailSuggestion(email='') {
      const clean = String(email || '').trim().toLowerCase();
      if (!clean.includes('@')) return null;
      const parts = clean.split('@');
      if (parts.length !== 2) return null;
      const [local, domain] = parts;
      if (!local || !domain) return null;
      const fixedDomain = EMAIL_DOMAIN_FIXES[domain];
      return fixedDomain ? `${local}@${fixedDomain}` : null;
    }

    function validateEmailValue(email='') {
      const clean = String(email || '').trim().toLowerCase();
      if (!clean) return { valid:false, message:t('Escribe un correo electrónico válido para continuar.','Enter a valid email address to continue.') };
      const suggestion = getEmailSuggestion(clean);
      if (suggestion && suggestion !== clean) return { valid:false, suggestion, message:t(`¿Quisiste decir ${suggestion}?`,`Did you mean ${suggestion}?`) };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { valid:false, message:t('Escribe un correo completo, por ejemplo nombre@gmail.com.','Enter a complete email, for example name@gmail.com.') };
      return { valid:true, message:'' };
    }

    function bindEmailValidation() {
      const emailInput = document.getElementById('email');
      const emailField = document.getElementById('emailField');
      const emailValidation = document.getElementById('emailValidation');
      if (!emailInput || !emailField || !emailValidation) return;
      const renderState = () => {
        const value = emailInput.value.trim();
        data.email = value; save(data);
        if (!value) { emailField.classList.remove('invalid'); emailValidation.hidden = true; emailValidation.innerHTML = ''; return; }
        const result = validateEmailValue(value);
        if (result.valid) { emailField.classList.remove('invalid'); emailValidation.hidden = true; emailValidation.innerHTML = ''; return; }
        emailField.classList.add('invalid');
        if (result.suggestion) {
          const label = t(`Corregir a ${result.suggestion}`,`Correct to ${result.suggestion}`);
          emailValidation.innerHTML = `${result.message} <button type="button" class="email-suggestion" data-email-suggestion="${result.suggestion}">${label}</button>`;
        } else emailValidation.textContent = result.message;
        emailValidation.hidden = false;
      };
      emailInput.addEventListener('input', renderState);
      emailInput.addEventListener('blur', renderState);
      emailValidation.addEventListener('click', e => {
        const button = e.target.closest('[data-email-suggestion]');
        if (!button) return;
        emailInput.value = button.dataset.emailSuggestion || '';
        renderState(); emailInput.focus();
      });
      renderState();
    }

    function formatPhoneValue(value='') {
      const digits = String(value || '').replace(/\D/g,'');
      if (!digits) return '';
      if (currentRegion === 'MX') {
        const d = digits.replace(/^52/,'').slice(0,10);
        if (d.length <= 3) return d;
        if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
        return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,10)}`;
      }
      const d = digits.slice(0,11);
      if (d.length === 11 && d.startsWith('1')) return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,11)}`;
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
      return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`;
    }

    function bindPhoneFormatting() {
      const phoneInput = document.getElementById('telefono');
      if (!phoneInput) return;
      const apply = () => { const formatted = formatPhoneValue(phoneInput.value); phoneInput.value = formatted; data.telefono = formatted; save(data); };
      phoneInput.addEventListener('input', apply); phoneInput.addEventListener('blur', apply); if (phoneInput.value) apply();
    }

    function validators() {
      if (data.product === 'corrido') return [
        () => !!data.paraQuien,
        () => data.nombre.length >= 2,
        () => !!data.ocasion,
        () => data.raices.length >= 20,
        () => data.trayectoria.length >= 20,
        () => data.personasClave.length >= 10,
        () => data.retos.length >= 10 || data.logros.length >= 10,
        () => data.cualidades.length >= 10,
        () => data.legado.length >= 10 && data.emocion.length >= 8,
        () => !!data.genero && !!data.voz && !!data.idioma && !!data.duracion,
        () => validateEmailValue(data.email).valid
      ];
      return [
        () => !!data.paraQuien,
        () => data.nombre.length >= 2,
        () => !!data.ocasion,
        () => !!data.genero && !!data.voz && !!data.idioma,
        () => data.cualidades.length >= 10,
        () => data.recuerdo.length >= 10,
        () => data.emocion.length >= 8,
        () => validateEmailValue(data.email).valid
      ];
    }

    function isValid() { collectInputs(); const v = validators(); return v[step] ? v[step]() : true; }

    function showError() {
      question.querySelector('.error')?.remove();
      const div = document.createElement('div'); div.className = 'error';
      const steps = getSteps();
      if (step === steps.length - 1) {
        const result = validateEmailValue(data.email);
        div.textContent = result.message || t('Escribe un correo electrónico válido para continuar.','Enter a valid email address to continue.');
        bindEmailValidation(); document.getElementById('email')?.focus();
      } else {
        div.textContent = t('Completa esta información para continuar. No necesitas escribir perfecto; solo danos suficiente contexto.','Complete this information to continue. It does not need to be perfect—just give us enough context.');
      }
      question.appendChild(div);
    }

    const songTips = [
      [t('Empieza simple.','Start simple.'),t('La relación nos ayuda a definir cercanía, lenguaje y tono emocional.','The relationship helps us set closeness, language, and emotional tone.')],
      [t('Usa el nombre real.','Use the real name.'),t('Escribe cómo le dices de verdad.','Use the name you actually call them.')],
      [t('Define el motivo.','Define the reason.'),t('La ocasión nos ayuda a decidir qué debe quedar al frente.','The occasion helps us decide what should lead the story.')],
      [t('El sonido también cuenta.','The sound tells the story too.'),t('Elige pensando en quién recibirá la canción.','Choose with the recipient in mind.')],
      [t('No busques palabras perfectas.','Do not look for perfect words.'),t('Escribe como hablas. Nosotros nos encargamos de convertirlo en música.','Write the way you speak. We will turn it into music.')],
      [t('Los detalles pequeños son oro.','Small details are gold.'),t('Lugares, apodos y momentos concretos evitan que suene genérica.','Places, nicknames, and specific moments keep it from sounding generic.')],
      [t('Piensa en la última sensación.','Think about the final feeling.'),t('Dinos si quieres orgullo, nostalgia, alegría, lágrimas o ganas de bailar.','Tell us if you want pride, nostalgia, joy, tears, or the urge to dance.')],
      [t('Ya casi está.','Almost there.'),t('Tu correo será el canal principal para la entrega.','Your email will be the main delivery channel.')]
    ];
    const corridoTips = [
      [t('El protagonista puede ser cualquiera.','The main person can be anyone.'),t('No tiene que ser tu propia vida.','It does not have to be your own life.')],
      [t('Usa el nombre de verdad.','Use the real name.'),t('Apodos familiares también pueden hacer la historia más cercana.','Family nicknames can make the story feel more personal.')],
      [t('Define por qué importa contarla.','Define why this story matters.'),t('Eso nos ayuda a decidir qué momentos deben tener más peso.','That helps us decide which moments deserve more weight.')],
      [t('Las raíces dan contexto.','Roots create context.'),t('Lugar, familia e infancia le dan identidad a la historia.','Place, family, and childhood give the story identity.')],
      [t('Los hechos primero.','Facts first.'),t('No necesitas escribir como escritor; nosotros encontramos la narrativa.','You do not need to write like a songwriter; we shape the narrative.')],
      [t('Las personas importan.','People matter.'),t('Nombres y vínculos hacen que la historia se sienta verdaderamente de ustedes.','Names and relationships make the story unmistakably yours.')],
      [t('No todo tiene que ser perfecto.','Not everything has to be perfect.'),t('Los retos hacen que los logros tengan más significado.','Challenges give achievements more meaning.')],
      [t('La personalidad evita clichés.','Personality prevents clichés.'),t('Hábitos, frases y valores son material creativo de alto valor.','Habits, phrases, and values are high-value creative details.')],
      [t('Piensa en el legado.','Think about the legacy.'),t('¿Qué dejó esta vida en las personas que la rodean?','What did this life leave in the people around them?')],
      [t('Ahora elegimos cómo debe sonar.','Now choose how it should sound.'),t('La historia ya está; aquí definimos la dirección musical.','The story is already there; here we define the musical direction.')],
      [t('Ya casi está.','Almost there.'),t('Tu correo será el canal principal para la entrega.','Your email will be the main delivery channel.')]
    ];

    function bindCounters() {
      const fields = [['nombre',60],['cualidades',900],['recuerdo',900],['frase',400],['emocion',900],['raices',1200],['trayectoria',1500],['personasClave',1200],['retos',1000],['logros',1000],['legado',1000]];
      fields.forEach(([id,max]) => {
        const el = document.getElementById(id); const count = document.getElementById(id+'Count'); if (!el || !count) return;
        const update = () => { count.textContent = `${el.value.length}/${max}`; }; el.addEventListener('input',update); update();
      });
    }

    function render() {
      const steps = getSteps();
      if (step > steps.length - 1) step = steps.length - 1;
      question.innerHTML = steps[step]();
      bindOptions(); bindVoiceArtistSelector(); bindCounters();
      if (step === steps.length - 1) { bindEmailValidation(); bindPhoneFormatting(); }
      const tips = data.product === 'corrido' ? corridoTips : songTips;
      if (railTipTitle && railTipText && tips[step]) { railTipTitle.textContent = tips[step][0]; railTipText.textContent = tips[step][1]; }
      const pct = Math.round(((step + 1) / steps.length) * 100);
      const isFinal = step === steps.length - 1;
      stepLabel.textContent = isFinal ? t('Paso final','Final step') : t(`Paso ${step + 1} de ${steps.length}`,`Step ${step + 1} of ${steps.length}`);
      pctLabel.textContent = t(`${pct}% completado`,`${pct}% complete`);
      bar.style.width = `${pct}%`;
      backBtn.disabled = step === 0;
      nextBtn.textContent = isFinal ? t('Revisar mi pedido →','Review my order →') : t('Siguiente →','Next →');
      syncProductChoiceUI();
      window.scrollTo({top:0,behavior:'smooth'});
    }

    nextBtn.addEventListener('click', () => {
      if (!isValid()) return showError();
      const steps = getSteps();
      if (step < steps.length - 1) { step += 1; render(); }
      else location.href = 'order.html';
    });
    backBtn.addEventListener('click', () => { collectInputs(); if (step > 0) { step -= 1; render(); } });

    if (explicitProduct) startSelectedProduct(productParam, {scroll:false}); else showProductChooser();
    setupExitIntent();
  }

  if (page === 'business') {
    const form = document.getElementById('businessForm');
    const status = document.getElementById('businessStatus');
    const emailInput = document.getElementById('businessEmail');
    const emailField = document.getElementById('businessEmailField');
    const emailValidation = document.getElementById('businessEmailValidation');
    const phoneInput = document.getElementById('businessPhone');
    const domainFixes = {'gmil.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','hotnail.com':'hotmail.com','hotmai.com':'hotmail.com','outlok.com':'outlook.com','yaho.com':'yahoo.com'};

    const validateBusinessEmail = () => {
      if (!emailInput) return {valid:true};
      const value = emailInput.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return {valid:false,message:currentLanguage==='en'?'Enter a valid email address.':'Escribe un correo electrónico válido.'};
      const [local,domain] = value.split('@');
      if (domainFixes[domain]) {
        const suggestion = `${local}@${domainFixes[domain]}`;
        return {valid:false,suggestion,message:currentLanguage==='en'?`Did you mean ${suggestion}?`:`¿Quisiste decir ${suggestion}?`};
      }
      return {valid:true};
    };

    const renderBusinessEmailState = () => {
      if (!emailInput || !emailValidation || !emailField) return true;
      if (!emailInput.value.trim()) { emailField.classList.remove('invalid'); emailValidation.hidden=true; emailValidation.textContent=''; return false; }
      const result = validateBusinessEmail();
      emailField.classList.toggle('invalid',!result.valid);
      if (result.valid) { emailValidation.hidden=true; emailValidation.textContent=''; return true; }
      emailValidation.hidden=false;
      if (result.suggestion) {
        const label=currentLanguage==='en'?`Correct to ${result.suggestion}`:`Corregir a ${result.suggestion}`;
        emailValidation.innerHTML=`${result.message} <button type="button" class="email-suggestion" data-business-email="${result.suggestion}">${label}</button>`;
      } else emailValidation.textContent=result.message;
      return false;
    };
    emailInput?.addEventListener('input',renderBusinessEmailState);
    emailInput?.addEventListener('blur',renderBusinessEmailState);
    emailValidation?.addEventListener('click',e=>{const b=e.target.closest('[data-business-email]');if(!b)return;emailInput.value=b.dataset.businessEmail||'';renderBusinessEmailState();emailInput.focus();});

    const formatBusinessPhone = () => {
      if (!phoneInput) return;
      const digits=phoneInput.value.replace(/\D/g,'');
      if (!digits) { phoneInput.value=''; return; }
      if (currentRegion==='MX') {
        const d=digits.replace(/^52/,'').slice(0,10);
        phoneInput.placeholder='614 123 4567';
        phoneInput.value=d.length<=3?d:d.length<=6?`${d.slice(0,3)} ${d.slice(3)}`:`${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,10)}`;
      } else {
        const d=digits.slice(0,10); phoneInput.placeholder='(714) 555-1234';
        phoneInput.value=d.length<=3?`(${d}`:d.length<=6?`(${d.slice(0,3)}) ${d.slice(3)}`:`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`;
      }
    };
    phoneInput?.addEventListener('input',formatBusinessPhone);
    window.addEventListener('sonalza:regionready',()=>{if(phoneInput){phoneInput.placeholder=currentRegion==='MX'?'614 123 4567':'(714) 555-1234';if(phoneInput.value)formatBusinessPhone();}});

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!renderBusinessEmailState()) { emailInput?.focus(); return; }
      const btn = form.querySelector('button[type="submit"]');
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      payload.region = currentRegion;
      payload.language = currentLanguage;
      payload.detectedRegion = detectedRegion;
      payload.regionOverride = localStorage.getItem(REGION_OVERRIDE_KEY)==='1';
      payload.currency = currentCurrency;
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = currentLanguage === 'en' ? 'Sending…' : 'Enviando…';
      if (status) { status.textContent=''; status.className='submit-status'; }
      try {
        const r = await fetch('/api/submit-lead', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const result = await r.json().catch(()=>({}));
        if (!r.ok || !result.ok) throw new Error(result.error || (currentLanguage==='en'?'We could not send the request.':'No pudimos enviar la solicitud.'));
        form.innerHTML = `<div class="business-success"><div class="eyebrow">${currentLanguage==='en'?'REQUEST RECEIVED':'SOLICITUD RECIBIDA'}</div><h2>${currentLanguage==='en'?'SONALZA received it.':'Ya llegó a SONALZA.'}</h2><p>${currentLanguage==='en'?'Reference':'Referencia'} <strong>${result.leadId}</strong>. ${currentLanguage==='en'?'We will reply using the email you provided.':'Te responderemos usando el correo que nos compartiste.'}</p><a href="index.html" class="btn btn-primary">${currentLanguage==='en'?'Back to home →':'Volver al inicio →'}</a></div>`;
      } catch(err) {
        if (status) { status.textContent=err.message; status.className='submit-status error-status'; }
        btn.disabled=false; btn.textContent=original;
      }
    });
  }

  if (page === 'order') {
    const data = load();
    const briefRows = document.getElementById('briefRows');
    const storyDetails = document.getElementById('storyDetails');
    function renderOrderBrief() {
      const rows = [
        [currentLanguage === 'en' ? 'Product' : 'Producto', data.product === 'corrido' ? (currentLanguage === 'en' ? 'A Life Corrido' : 'Corrido de una Vida') : (currentLanguage === 'en' ? 'Custom Song' : 'Canción personalizada')],
        [currentLanguage === 'en' ? 'For' : 'Para', `${data.nombre || (currentLanguage === 'en' ? 'No name' : 'Sin nombre')} (${currentLanguage === 'en' ? translatePhrase(data.paraQuien || 'Sin especificar') : (data.paraQuien || 'Sin especificar')})`],
        [currentLanguage === 'en' ? 'Occasion' : 'Ocasión', currentLanguage === 'en' ? translatePhrase(data.ocasion || 'Sin especificar') : (data.ocasion || 'Sin especificar')],
        [currentLanguage === 'en' ? 'Style' : 'Estilo', currentLanguage === 'en' ? translatePhrase(data.genero || 'Sin especificar') : (data.genero || 'Sin especificar')],
        [currentLanguage === 'en' ? 'Voice' : 'Voz', currentLanguage === 'en' ? translatePhrase(data.voz || 'Sin especificar') : (data.voz || 'Sin especificar')],
        [currentLanguage === 'en' ? 'Language' : 'Idioma', currentLanguage === 'en' ? translatePhrase(data.idioma || 'Español') : (data.idioma || 'Español')],
        [currentLanguage === 'en' ? 'Length' : 'Duración', data.product === 'corrido' ? (data.duracion || (currentLanguage === 'en' ? 'Not specified' : 'Sin especificar')) : (currentLanguage === 'en' ? 'Approx. 2–3 min' : '2–3 min aprox.')],
        [currentLanguage === 'en' ? 'Email' : 'Correo', data.email || (currentLanguage === 'en' ? 'Not specified' : 'Sin especificar')]
      ];
      briefRows.innerHTML = rows.map(([label, value]) => `<div class="brief-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
      if (storyDetails) {
        if (data.product === 'corrido') {
          const lifeRows = [
            [currentLanguage === 'en' ? 'Roots & early years' : 'Raíces e infancia', data.raices],
            [currentLanguage === 'en' ? 'Life journey' : 'Trayectoria', data.trayectoria],
            [currentLanguage === 'en' ? 'Key people' : 'Personas clave', data.personasClave],
            [currentLanguage === 'en' ? 'Challenges' : 'Retos y sacrificios', data.retos],
            [currentLanguage === 'en' ? 'Achievements' : 'Logros', data.logros],
            [currentLanguage === 'en' ? 'Legacy' : 'Legado', data.legado]
          ].filter(([,value]) => String(value || '').trim());
          storyDetails.innerHTML = `<details class="story-details"><summary>${currentLanguage === 'en' ? 'Review life-story details' : 'Revisar detalles de la historia de vida'}</summary><div class="story-details-body">${lifeRows.map(([label,value]) => `<div><span>${escapeHtml(label)}</span><p>${escapeHtml(value)}</p></div>`).join('')}</div></details>`;
        } else storyDetails.innerHTML = '';
      }
    }
    renderOrderBrief();


    function escapeHtml(value='') {
      return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    }

    const totalEl = document.getElementById('total');
    const basePriceEl = document.getElementById('basePrice');
    const baseComparePriceEl = document.getElementById('baseComparePrice');
    const baseSavingsEl = document.getElementById('baseSavings');
    const currencyLabel = document.getElementById('orderCurrencyLabel');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addons = [...document.querySelectorAll('.addon')];
    const couponToggle = document.getElementById('couponToggle');
    const couponPanel = document.getElementById('couponPanel');
    const couponCode = document.getElementById('couponCode');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponStatus = document.getElementById('couponStatus');
    const couponDiscountRow = document.getElementById('couponDiscountRow');
    const couponDiscountEl = document.getElementById('couponDiscount');
    let appliedCoupon = null;
    const termsAccept = document.getElementById('termsAccept');
    const privacyAccept = document.getElementById('privacyAccept');
    const materialsAccept = document.getElementById('materialsAccept');
    const TERMS_VERSION = '2026-09-06-v3';
    const PRIVACY_VERSION = '2026-09-06-v3';
    let pendingCoverFile = null;

    function syncLegalConsentState() {
      const accepted = Boolean(termsAccept?.checked && privacyAccept?.checked && materialsAccept?.checked);
      if (checkoutBtn) checkoutBtn.classList.toggle('legal-pending', !accepted);
      return accepted;
    }
    termsAccept?.addEventListener('change', syncLegalConsentState);
    privacyAccept?.addEventListener('change', syncLegalConsentState);
    materialsAccept?.addEventListener('change', syncLegalConsentState);

    function bindCoverAddonInputs() {
      const premiumToggle = document.querySelector('.addon[data-key="premium"]');
      const detail = document.getElementById('premiumCoverOptions');
      const promptInput = document.getElementById('coverPrompt');
      const cropInput = document.getElementById('coverCropMustShow');
      const fileInput = document.getElementById('coverFile');
      const fileName = document.getElementById('coverFileName');
      const previewWrap = document.getElementById('coverPreviewWrap');
      const previewImage = document.getElementById('coverPreviewImage');
      if (!premiumToggle || !detail) return;

      if (promptInput) {
        promptInput.value = data.coverPrompt || '';
        promptInput.addEventListener('input', () => { data.coverPrompt = promptInput.value.trim(); save(data); });
      }
      if (cropInput) {
        cropInput.value = data.coverCropMustShow || '';
        cropInput.addEventListener('input', () => { data.coverCropMustShow = cropInput.value.trim(); save(data); });
      }
      if (fileInput) {
        fileInput.addEventListener('change', () => {
          const file = fileInput.files && fileInput.files[0];
          if (!file) {
            pendingCoverFile = null;
            data.coverImageName = '';
            data.coverImagePath = '';
            save(data);
            if (fileName) { fileName.hidden = true; fileName.textContent = ''; }
            if (previewWrap) previewWrap.hidden = true;
            if (previewImage) previewImage.removeAttribute('src');
            return;
          }
          pendingCoverFile = file;
          data.coverImageName = file.name;
          data.coverImagePath = '';
          save(data);
          if (fileName) { fileName.hidden = false; fileName.textContent = file.name; }
          if (previewWrap && previewImage && file.type && file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            previewImage.src = objectUrl;
            previewWrap.hidden = false;
          }
        });
        if (data.coverImageName && fileName) {
          fileName.hidden = false;
          fileName.textContent = data.coverImageName;
        }
      }
      const sync = () => { detail.hidden = !premiumToggle.checked; };
      premiumToggle.addEventListener('change', sync);
      sync();
    }

    couponToggle?.addEventListener('click', () => {
      const open = couponPanel && couponPanel.hidden;
      if (couponPanel) couponPanel.hidden = !open;
      const icon = couponToggle.querySelector('span');
      if (icon) icon.textContent = open ? '−' : '+';
      if (open) couponCode?.focus();
    });

    async function validateCoupon() {
      const code = String(couponCode?.value || '').trim().toUpperCase();
      if (!code) {
        appliedCoupon = null;
        if (couponStatus) { couponStatus.textContent = currentLanguage === 'en' ? 'Enter a coupon code.' : 'Escribe un código de cupón.'; couponStatus.className='coupon-status error'; }
        updateTotal();
        return;
      }
      if (applyCouponBtn) applyCouponBtn.disabled = true;
      if (couponStatus) { couponStatus.textContent = currentLanguage === 'en' ? 'Checking coupon…' : 'Validando cupón…'; couponStatus.className='coupon-status'; }
      try {
        const productKey = data.product === 'corrido' ? 'corrido' : 'song';
        const r = await fetch('/api/validate-coupon', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,product:productKey,region:currentRegion,language:currentLanguage})});
        const result = await r.json().catch(()=>({}));
        if (!r.ok || !result.ok) throw new Error(result.error || (currentLanguage === 'en' ? 'This coupon is not valid.' : 'Este cupón no es válido.'));
        appliedCoupon = {code:result.code,discount:Number(result.discount || 0),label:result.label || result.code};
        if (couponStatus) { couponStatus.textContent = `${currentLanguage === 'en' ? 'Coupon applied' : 'Cupón aplicado'}: ${appliedCoupon.label}`; couponStatus.className='coupon-status success'; }
        updateTotal();
      } catch(err) {
        appliedCoupon = null;
        if (couponStatus) { couponStatus.textContent = err.message; couponStatus.className='coupon-status error'; }
        updateTotal();
      } finally { if (applyCouponBtn) applyCouponBtn.disabled = false; }
    }
    applyCouponBtn?.addEventListener('click', validateCoupon);
    couponCode?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); validateCoupon(); } });

    const updateTotal = () => {
      const productKey = data.product === 'corrido' ? 'corrido' : 'song';
      const base = PRICING[productKey][currentCurrency];
      let total = base;
      const productLabel = document.getElementById('orderProductLabel');
      if (productLabel) productLabel.textContent = productKey === 'corrido' ? translatePhrase('Corrido de una Vida') : translatePhrase('Canción personalizada');
      if (basePriceEl) basePriceEl.textContent = formatMoney(base);
      if (baseComparePriceEl) baseComparePriceEl.textContent = formatMoney(LIST_PRICING[productKey][currentCurrency]);
      if (baseSavingsEl) baseSavingsEl.textContent = `−${formatMoney(LIST_PRICING[productKey][currentCurrency] - base)}`;
      addons.forEach(addon => {
        const key = addon.dataset.key;
        const price = PRICING[key][currentCurrency];
        const label = addon.closest('.upsell')?.querySelector('.addon-price');
        if (label) label.textContent = `+${formatMoney(price)}`;
        if (addon.checked) total += price;
      });
      if (appliedCoupon && appliedCoupon.discount > 0) {
        const discount = Math.min(total, appliedCoupon.discount);
        total -= discount;
        if (couponDiscountEl) couponDiscountEl.textContent = `−${formatMoney(discount)}`;
        if (couponDiscountRow) couponDiscountRow.hidden = false;
      } else {
        if (couponDiscountRow) couponDiscountRow.hidden = true;
      }
      if (totalEl) totalEl.textContent = formatMoney(total);
      if (currencyLabel) currencyLabel.textContent = `${REGIONS[currentRegion].flag} ${currentRegion} · ${currentCurrency}`;
      const verificationNote = document.getElementById('regionVerificationNote');
      const mismatch = Boolean(detectedRegion && detectedRegion !== currentRegion);
      if (verificationNote) {
        verificationNote.hidden = !mismatch;
        verificationNote.innerHTML = mismatch ? (currentLanguage === 'en'
          ? `<strong>Region verification required.</strong> We detected ${REGIONS[detectedRegion].labelEn}. The ${REGIONS[currentRegion].labelEn} regional price will only apply if the billing country is verified as ${REGIONS[currentRegion].labelEn} when payment is enabled.`
          : `<strong>Se requiere verificar la región.</strong> Detectamos ${REGIONS[detectedRegion].labelEs}. El precio regional de ${REGIONS[currentRegion].labelEs} solo aplicará si el país de facturación se verifica como ${REGIONS[currentRegion].labelEs} cuando habilitemos el pago.`) : '';
      }
      if (checkoutBtn) checkoutBtn.textContent = `${currentLanguage === 'en' ? 'Register order' : 'Registrar pedido'} · ${formatMoney(total)} →`;
    };

    function readFileDataUrl(file) {
      return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(currentLanguage === 'en' ? 'We could not read the selected image.' : 'No pudimos leer la imagen seleccionada.'));
        reader.readAsDataURL(file);
      });
    }

    async function prepareImageForUpload(file) {
      const rawUrl = await readFileDataUrl(file);
      if (!/^data:image\//.test(rawUrl)) throw new Error(currentLanguage === 'en' ? 'Choose a valid image file.' : 'Selecciona un archivo de imagen válido.');
      const img = await new Promise((resolve,reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error(currentLanguage === 'en' ? 'We could not prepare this image. Try JPG or PNG.' : 'No pudimos preparar esta imagen. Intenta con JPG o PNG.'));
        el.src = rawUrl;
      });
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
      const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
      const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', .86);
      return { dataBase64: compressed.split(',')[1] || '', mimeType:'image/jpeg', fileName:String(file.name || 'cover').replace(/\.[^.]+$/,'') + '.jpg' };
    }

    async function uploadCoverIfNeeded(chosenAddons) {
      if (!chosenAddons.includes('premium') || !pendingCoverFile) return;
      if (pendingCoverFile.size > 15 * 1024 * 1024) throw new Error(currentLanguage === 'en' ? 'The original image is too large. Choose a photo under 15 MB.' : 'La imagen original es demasiado grande. Elige una foto menor de 15 MB.');
      if (!String(pendingCoverFile.type || '').startsWith('image/')) throw new Error(currentLanguage === 'en' ? 'Choose a valid image file.' : 'Selecciona un archivo de imagen válido.');
      const prepared = await prepareImageForUpload(pendingCoverFile);
      const r = await fetch('/api/upload-cover', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(prepared)});
      const result = await r.json().catch(()=>({}));
      if (!r.ok || !result.ok) throw new Error(result.error || (currentLanguage === 'en' ? 'We could not save the cover photo.' : 'No pudimos guardar la foto de portada.'));
      data.coverImagePath = result.path || '';
      save(data);
    }

    bindCoverAddonInputs();
    addons.forEach(a => a.addEventListener('change', updateTotal));
    window.addEventListener('sonalza:currencychange', updateTotal);
    window.addEventListener('sonalza:regionready', () => { renderOrderBrief(); updateTotal(); });
    checkoutBtn?.addEventListener('click', async () => {
      const original = checkoutBtn.textContent;
      const statusEl = document.getElementById('submitStatus');
      if (!syncLegalConsentState()) {
        if (statusEl) { statusEl.textContent = currentLanguage === 'en' ? 'Please accept the Terms, Privacy Policy, and material-rights confirmation before continuing.' : 'Acepta los Términos, la Política de privacidad y la confirmación sobre tus materiales antes de continuar.'; statusEl.className='submit-status error-status'; }
        document.getElementById('legalConsents')?.scrollIntoView({behavior:'smooth',block:'center'});
        return;
      }
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = currentLanguage === 'en' ? 'Registering your order…' : 'Registrando tu pedido…';
      if (statusEl) { statusEl.textContent = ''; statusEl.className = 'submit-status'; }
      try {
        const chosenAddons = addons.filter(a=>a.checked).map(a=>a.dataset.key);
        if (chosenAddons.includes('premium') && data.coverImageName && !pendingCoverFile && !data.coverImagePath) {
          throw new Error(currentLanguage === 'en' ? 'Please select the cover photo again before registering the order.' : 'Vuelve a seleccionar la foto de portada antes de registrar el pedido.');
        }
        await uploadCoverIfNeeded(chosenAddons);
        const utmParams = new URLSearchParams(location.search);
        const utm = {};
        ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{ if(utmParams.get(k)) utm[k]=utmParams.get(k); });
        const response = await fetch('/api/submit-order', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({draft:data,region:currentRegion,language:currentLanguage,currency:currentCurrency,detectedRegion,regionOverride:localStorage.getItem(REGION_OVERRIDE_KEY)==='1',addons:chosenAddons,couponCode:appliedCoupon?.code || '',page:location.href,referrer:document.referrer,utm,termsAccepted:true,privacyAccepted:true,materialsAccepted:true,termsVersion:TERMS_VERSION,privacyVersion:PRIVACY_VERSION,acceptedAt:new Date().toISOString()})
        });
        const result = await response.json().catch(()=>({}));
        if (!response.ok || !result.ok) throw new Error(result.error || 'No pudimos registrar el pedido.');
        sessionStorage.setItem('sonalzaLastOrder', JSON.stringify(result));
        location.href = `thanks.html?order=${encodeURIComponent(result.orderId)}`;
      } catch (err) {
        if (statusEl) { statusEl.textContent = err.message; statusEl.className = 'submit-status error-status'; }
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = original;
      }
    });
    updateTotal();
    syncLegalConsentState();
    setupExitIntent();
  }

  setupRevealAnimations();
  setupParallax();
  setupLocalePicker();
})();
