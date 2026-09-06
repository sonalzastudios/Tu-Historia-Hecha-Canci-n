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
  const TEXT_EN = {"OFERTA DE LANZAMIENTO":"LAUNCH OFFER","Tu canción personalizada desde":"Your custom song from","Ver precios →":"See pricing →","Ideas":"Ideas","Estilos":"Styles","Precios":"Pricing","Cómo funciona":"How it works","Crear mi canción":"Create my song","Crear":"Create","Ideas para regalar":"Gift ideas","Estilos musicales":"Music styles","Música para negocios":"Music for business","MÚSICA PERSONALIZADA · HECHA EN ESPAÑOL PRIMERO":"CUSTOM MUSIC · BUILT AROUND YOUR STORY","Hay historias que no caben en una tarjeta.":"Some stories do not fit on a card.","Hazla canción.":"Turn yours into a song.","Cuéntanos nombres, recuerdos, frases y momentos reales. SONALZA los convierte en una canción con dirección musical latina, hecha para que la persona se reconozca dentro de ella.":"Share real names, memories, phrases, and moments. SONALZA turns them into a song with Latin musical direction, made so the person can recognize their own story in it.","No sé por dónde empezar":"I’m not sure where to start","Desde":"From","1 revisión incluida · entrega digital":"1 revision included · digital delivery","Brief guiado, fácil de llenar":"Guided brief, easy to complete","Corrido, banda, cumbia y más":"Corrido, banda, cumbia and more","1 revisión incluida":"1 revision included","SONALZA · SESIÓN CREATIVA":"SONALZA · CREATIVE SESSION","Tu historia, dirigida como una pieza única":"Your story, directed as a one-of-a-kind piece","Historia real":"Real story","Detalles, nombres y recuerdos tuyos.":"Your details, names, and memories.","Identidad musical":"Musical identity","Corrido, banda, norteño, cumbia y más.":"Corrido, banda, norteño, cumbia and more.","Para ajustar la dirección si hace falta.":"To adjust the direction if needed.","USD o MXN":"Country-based pricing","Elige la moneda antes de ordenar.":"Your country sets the currency and regional price.","EMPIEZA POR LA EMOCIÓN":"START WITH THE EMOTION","No necesitas saber de música. Solo saber qué quieres decir.":"You do not need to know music. You only need to know what you want to say.","Elige la idea que más se parezca a la tuya y te llevamos al brief con parte de la dirección ya preparada.":"Choose the idea closest to yours and we will take you into the brief with part of the direction already prepared.","Para alguien que amo":"For someone I love","Aniversario, pareja, agradecimiento o simplemente decir lo que a veces cuesta poner en palabras.":"Anniversary, partner, gratitude, or simply saying what can be hard to put into words.","Empezar esta canción →":"Start this song →","RAÍZ":"ROOTS","Para mamá, papá o familia":"For mom, dad, or family","Una historia de raíces, sacrificios, recuerdos y todo lo que esa persona dejó en ti.":"A story of roots, sacrifices, memories, and everything that person left in you.","Contar nuestra historia →":"Tell our story →","VIDA":"LIFE","Quiero contar una vida":"I want to tell a life story","Trayectoria, migración, trabajo, familia, logros y legado contados como una pieza más profunda.":"A life journey, migration, work, family, achievements, and legacy told as a deeper piece.","Crear mi corrido →":"Create my corrido →","MARCA":"BRAND","Quiero música para mi negocio":"I want music for my business","Jingles, hooks y piezas memorables para anuncios, redes, productos o identidad de marca.":"Jingles, hooks, and memorable pieces for ads, social media, products, or brand identity.","Ver opción comercial →":"See business option →","EL ENFOQUE SONALZA":"THE SONALZA APPROACH","No empezamos con una plantilla.":"We do not start with a template.","Empezamos contigo.":"We start with you.","Una buena canción personalizada no se siente como un formulario convertido en música. Debe reconocer personas, lugares, frases, recuerdos y emociones que solamente ustedes entienden.":"A great custom song should not feel like a form turned into music. It should recognize people, places, phrases, memories, and emotions only you understand.","Historia primero":"Story first","Los detalles específicos son el material creativo, no un relleno.":"Specific details are the creative material, not filler.","Identidad musical real":"Real musical identity","No metemos todo dentro de “latino”. Corrido, banda, norteño, cumbia y mariachi tienen personalidad propia.":"We do not put everything under “Latin.” Corrido, banda, norteño, cumbia, and mariachi each have their own identity.","Una experiencia clara":"A clear experience","Tú eliges la dirección. Nosotros guiamos el brief para obtener mejores detalles.":"You choose the direction. We guide the brief to capture better details.","LATINO SIN CLICHÉS · HECHO CON RAÍCES":"LATIN WITHOUT CLICHÉS · ROOTED IN REAL STORIES","Nuestra música cambia de acento, de ritmo y de historia.":"Our music changes with the accent, rhythm, and story.","Familia, amor, trabajo, migración, celebración, sacrificios y legado. No reducimos “lo latino” a un solo sonido: cuidamos el género, las palabras y la emoción que pide cada historia.":"Family, love, work, migration, celebration, sacrifice, and legacy. We do not reduce “Latin” to one sound: we respect the genre, words, and emotion each story calls for.","RAÍCES":"ROOTS","Que suene cercana, no prefabricada.":"Make it feel close, not manufactured.","El género, las palabras y el tono deben respetar de dónde viene la historia.":"The genre, words, and tone should respect where the story comes from.","EMOCIÓN":"EMOTION","Que diga eso que no siempre sabemos decir.":"Say what we do not always know how to say.","La meta es que nombres, frases y recuerdos provoquen reconocimiento real.":"The goal is for names, phrases, and memories to create genuine recognition.","RITMO":"RHYTHM","Que tenga alma, pero también movimiento.":"Give it soul, but also movement.","Podemos emocionar con un mariachi, contar con un corrido o celebrar con una cumbia.":"We can move someone with mariachi, tell a story with corrido, or celebrate with cumbia.","Elige el mundo musical de tu historia.":"Choose the musical world of your story.","HISTORIAS QUE SUENAN":"STORIES THAT SOUND LIKE YOU","Desde una historia familiar contada como corrido hasta una cumbia para celebrar, el género cambia por completo la emoción de la canción.":"From a family story told as a corrido to a cumbia made to celebrate, the genre completely changes the emotion of the song.","Vida, migración, familia, logros, legado y momentos que merecen quedar contados.":"Life, migration, family, achievements, legacy, and moments worth preserving.","REGIONAL MEXICANO":"REGIONAL MEXICAN","Metales, emoción y una energía grande para historias grandes.":"Brass, emotion, and big energy for big stories.","PODER + EMOCIÓN":"POWER + EMOTION","Acordeón, cercanía y sabor para historias románticas o de familia.":"Accordion, warmth, and character for romantic or family stories.","RAÍZ + SENTIMIENTO":"ROOTS + FEELING","Para celebrar, bailar y convertir un recuerdo en algo imposible de quedarse sentado.":"For celebrating, dancing, and turning a memory into something impossible to sit still to.","RITMO + ALEGRÍA":"RHYTHM + JOY","Clásico, emotivo y directo al corazón para familia, amor y homenajes.":"Classic, emotional, and straight to the heart for family, love, and tributes.","TRADICIÓN + ALMA":"TRADITION + SOUL","Más estilos":"More styles","Duranguense, huapango, sierreño, pop latino, reguetón, balada y más.":"Duranguense, huapango, sierreño, Latin pop, reggaeton, ballads, and more.","TÚ ELIGES":"YOU CHOOSE","TRES FORMAS DE CREAR CON SONALZA":"THREE WAYS TO CREATE WITH SONALZA","Elige qué quieres convertir en música.":"Choose what you want to turn into music.","La canción personal, la historia de vida y la música para negocios son productos distintos. Cada uno necesita un proceso distinto.":"A personal song, a life story, and music for business are different products. Each needs a different process.","PARA REGALAR":"TO GIFT","Canción Personalizada":"Custom Song","Cumpleaños, aniversario, agradecimiento, amor, amistad, familia o simplemente porque sí.":"Birthday, anniversary, gratitude, love, friendship, family, or simply because.","OFERTA DE LANZAMIENTO · TIEMPO LIMITADO":"LAUNCH OFFER · LIMITED TIME","PRECIO ESPECIAL":"SPECIAL PRICE","Ahorras":"You save","Canción completa personalizada":"Complete custom song","Género, voz e idioma":"Genre, voice, and song language","Brief guiado de tu historia":"Guided story brief","Comenzar mi canción →":"Start my song →","HISTORIA DE VIDA":"LIFE STORY","Corrido de Tu Vida":"Your Life Corrido","Una narrativa más profunda para contar trayectoria, raíces, familia, sacrificios y legado.":"A deeper narrative to tell a life journey, roots, family, sacrifice, and legacy.","Brief narrativo ampliado":"Expanded narrative brief","Dirección regional mexicana":"Regional Mexican direction","Mayor profundidad en la letra":"Deeper lyric development","Proceso premium":"Premium process","Quiero contar mi historia →":"I want to tell my story →","PARA NEGOCIOS":"FOR BUSINESS","Jingles y Música para Marcas":"Jingles & Brand Music","Hooks, jingles y piezas musicales para marcas, productos, anuncios y contenido social.":"Hooks, jingles, and musical pieces for brands, products, ads, and social content.","Brief comercial":"Business brief","Versiones cortas para redes":"Short versions for social","Opciones instrumental y vocal":"Instrumental and vocal options","Licencia según proyecto":"License based on project","Solicitar propuesta →":"Request a proposal →","Elige tu moneda":"Your country sets your price","Los precios se muestran en la moneda que selecciones y se mantienen durante el pedido.":"Choose your country above. United States orders are priced in USD; Mexico orders are priced in MXN.","* Oferta de lanzamiento por tiempo limitado. Los precios en MXN se fijaron comercialmente tomando como referencia el tipo de cambio vigente y se redondearon para mantener precios claros. No cambian automáticamente con el mercado. Impuestos y método de pago se validarán antes del cargo.":"* Limited-time launch offer. Regional prices are set commercially for each market and do not automatically track exchange rates. Taxes and payment method are validated before the charge.","TU SESIÓN CREATIVA":"YOUR CREATIVE SESSION","De un recuerdo a una canción.":"From a memory to a song.","No necesitas saber escribir letras ni hablar “como músico”. Solamente necesitas conocer tu propia historia.":"You do not need to write lyrics or speak “like a musician.” You only need to know your own story.","Iniciar el brief creativo →":"Start the creative brief →","Define para quién es":"Define who it is for","Nombre, relación y ocasión. Ese es el contexto emocional.":"Name, relationship, and occasion. That is the emotional context.","Danos los detalles que nadie más conoce":"Give us the details no one else knows","Recuerdos, cualidades, lugares, frases y pequeños detalles reales.":"Memories, qualities, places, phrases, and small real details.","Elige la dirección musical":"Choose the musical direction","Género, voz e idioma para que la canción se sienta correcta.":"Genre, voice, and song language so it feels right.","Recibe algo hecho para esa historia":"Receive something made for that story","La meta no es solamente que suene bien. Es que se reconozcan dentro de ella.":"The goal is not only for it to sound good. It is for them to recognize themselves in it.","EL ESTÁNDAR SONALZA":"THE SONALZA STANDARD","Tu historia merece cuidado en cada detalle.":"Your story deserves care in every detail.","Desde el brief hasta la entrega, buscamos una experiencia clara, privada y profesional. Tú aportas la historia; SONALZA define la dirección creativa para convertirla en música.":"From the brief to delivery, we aim for a clear, private, professional experience. You bring the story; SONALZA shapes the creative direction to turn it into music.","TU HISTORIA YA EXISTE":"YOUR STORY ALREADY EXISTS","Ahora falta convertirla en música.":"Now it is time to turn it into music.","Crear mi canción →":"Create my song →","Crear canción →":"Create song →","Tu historia. Tu canción.":"Your story. Your song.","Negocios":"Business","Salir del estudio ×":"Exit studio ×","Paso 1 de 8":"Step 1 of 8","13% completado":"13% complete","TU BRIEF SONALZA":"YOUR SONALZA BRIEF","Fácil de llenar. Profundo donde importa.":"Easy to complete. Deep where it matters.","No necesitas escribir bonito ni saber de música. Te vamos guiando una pregunta a la vez.":"You do not need to write beautifully or know music. We guide you one question at a time.","3–5 minutos":"3–5 minutes","para completar el brief":"to complete the brief","Detalles reales":"Real details","nombres, recuerdos y frases":"names, memories, and phrases","Sin lenguaje técnico":"No technical language","nosotros traducimos la historia a música":"we translate the story into music","TIP SONALZA":"SONALZA TIP","Empieza simple.":"Start simple.","Elige para quién es. Nosotros te iremos pidiendo lo demás.":"Choose who it is for. We will guide you through the rest.","/ TU HISTORIA, TU CANCIÓN":"/ YOUR STORY, YOUR SONG","Una pregunta a la vez":"One question at a time","Tu avance se guarda en este dispositivo":"Your progress is saved on this device","← Atrás":"← Back","Siguiente →":"Next →","ANTES DE CERRAR":"BEFORE YOU LEAVE","¿Qué te hizo detenerte?":"What made you stop?","Esta respuesta nos ayuda a mejorar SONALZA y entender qué necesita el cliente antes de ordenar.":"This helps us improve SONALZA and understand what customers need before ordering.","Precio":"Price","El costo se siente más alto de lo esperado.":"The cost feels higher than expected.","Quiero escuchar más":"I want to hear more","Necesito más ejemplos antes de decidir.":"I need more examples before deciding.","Dudas sobre mi historia":"Concerns about my story","No sé si podrán capturarla como quiero.":"I am not sure you can capture it the way I want.","No encontré mi estilo":"I did not find my style","Busco otro género o dirección musical.":"I am looking for another genre or musical direction.","Forma de pago":"Payment method","Necesito una opción de pago diferente.":"I need a different payment option.","Sigo comparando":"I am still comparing","Todavía estoy explorando opciones.":"I am still exploring options.","Otro motivo":"Another reason","Algo distinto a lo anterior.":"Something different from the options above.","En esta versión de prueba, la respuesta se guarda únicamente en este navegador.":"In this test version, the response is saved only in this browser.","¿Para quién es esta canción?":"Who is this song for?","Elige la relación más cercana. Si no aparece exactamente, selecciona “Otro”.":"Choose the closest relationship. If it is not listed exactly, select “Other.”","¿Por qué te lo preguntamos?":"Why do we ask?","La relación cambia el tono de la letra y la forma de contar la historia.":"The relationship changes the tone of the lyrics and how the story is told.","Esposo":"Husband","Esposa":"Wife","Pareja":"Partner","Novio":"Boyfriend","Novia":"Girlfriend","Papá":"Dad","Mamá":"Mom","Hijo":"Son","Hija":"Daughter","Abuelo/a":"Grandparent","Hermano/a":"Sibling","Amigo/a":"Friend","Para mí":"Myself","Otro":"Other","¿Cómo se llama?":"What is their name?","Escribe el nombre tal como quieres que aparezca o se cante.":"Write the name exactly as you want it to appear or be sung.","Ejemplo":"Example","“José”, “Mamá Lupita”, “Mi viejo”, “César”. Usa la forma que realmente le dices.":"“José,” “Mom Lupita,” “Mi viejo,” “César.” Use the name you actually call them.","Nombre":"Name","Ejemplo: Julián":"Example: Julian","Así lo usaremos dentro del brief.":"This is how we will use it in the brief.","¿Cuál es la ocasión?":"What is the occasion?","Elige la ocasión que mejor explica por qué estás creando esta canción.":"Choose the occasion that best explains why you are creating this song.","No tiene que ser una fecha especial.":"It does not have to be a special date.","“Porque sí”, “Te amo” o “Gracias” también pueden producir canciones muy fuertes.":"“Just because,” “I love you,” or “Thank you” can also make powerful songs.","Porque sí":"Just because","Te amo":"I love you","Cumpleaños":"Birthday","Aniversario":"Anniversary","Te extraño":"Missing you","Gracias":"Thank you","Perdón":"Apology","Boda":"Wedding","Amistad":"Friendship","En memoria":"In memory","Logro especial":"Milestone","Propuesta":"Proposal","Jubilación":"Retirement","Graduación":"Graduation","Otra ocasión":"Something else","Elige el estilo de la canción":"Choose the song style","Elige la dirección musical. Si no estás seguro, “Sorpréndeme” nos deja proponerla.":"Choose the musical direction. If you are not sure, “Surprise me” lets us propose one.","Piensa en la persona que la recibirá.":"Think about the person receiving it.","No elijas solo tu género favorito: elige el que más conectaría con esa historia.":"Do not choose only your favorite genre; choose the one that best connects with the story.","Sorpréndeme":"Surprise me","Voz":"Voice","Masculina":"Male","Femenina":"Female","Idioma de la canción":"Song language","Español":"Spanish","Inglés":"English","Bilingüe":"Bilingual","Sus mejores cualidades":"Their best qualities","Cómo es":"What they are like","Qué admiras":"What you admire","Qué hace por ustedes":"What they do for you","Escribe natural. No necesitas rimar.":"Write naturally. You do not need to rhyme.","Comparte un recuerdo inolvidable":"Share an unforgettable memory","Los detalles específicos hacen que la canción se sienta verdaderamente personal.":"Specific details make the song feel truly personal.","Un lugar":"A place","Una anécdota":"A story","Una frase":"A phrase","Un momento":"A moment","Momento especial":"Special moment","Entre más específico, menos genérica se sentirá la canción.":"The more specific you are, the less generic the song will feel.","¿Qué quieres que sienta al escucharla?":"What do you want them to feel when they hear it?","Dinos el mensaje que debe quedar en el corazón de quien la reciba.":"Tell us the message you want to remain in their heart.","Frase que te gustaría escuchar":"Phrase you would like to hear","(opcional)":"(optional)","Puede ser una frase familiar o algo que tú quieres decirle.":"It can be a family phrase or something you want to say.","Mensaje principal":"Main message","Piensa en cómo quieres que se sienta al terminar.":"Think about how you want them to feel at the end.","Paso final":"Final step","¿A dónde enviamos tu canción?":"Where should we send your song?","Usaremos estos datos para identificar tu pedido y comunicarnos contigo sobre la entrega.":"We will use these details to identify your order and contact you about delivery.","Tu historia es privada.":"Your story is private.","No necesitas publicar nada para crear tu canción.":"You do not need to publish anything to create your song.","Correo electrónico":"Email address","Teléfono":"Phone","Más adelante podremos usarlo para avisos de entrega por mensaje de texto.":"Later we may use it for delivery updates by text message.","Revisar mi pedido →":"Review my order →","Escribe un correo electrónico válido para continuar.":"Enter a valid email address to continue.","Completa esta información para continuar.":"Complete this information to continue.","La relación nos ayuda a definir cercanía, lenguaje y tono emocional.":"The relationship helps us define closeness, language, and emotional tone.","Usa el nombre real.":"Use the real name.","Escribe cómo le dices de verdad. Ese detalle puede hacer que la canción se sienta mucho más personal.":"Write the name you actually use. That detail can make the song feel much more personal.","Define el motivo.":"Define the reason.","La ocasión nos ayuda a decidir qué debe quedar al frente: celebración, amor, gratitud, homenaje o memoria.":"The occasion helps us decide what should lead: celebration, love, gratitude, tribute, or memory.","El sonido también cuenta la historia.":"The sound also tells the story.","Un corrido narra distinto a una cumbia. Elige pensando en quién recibirá la canción.":"A corrido tells a story differently from a cumbia. Choose with the recipient in mind.","No busques palabras perfectas.":"Do not look for perfect words.","Escribe como hablas. Nosotros nos encargamos de convertir esas ideas en una letra musical.":"Write the way you speak. We will turn those ideas into musical lyrics.","Los detalles pequeños son oro.":"Small details are gold.","Lugares, apodos, frases y momentos concretos son lo que evita que la canción se sienta genérica.":"Places, nicknames, phrases, and specific moments are what keep the song from feeling generic.","Piensa en la última sensación.":"Think about the final feeling.","¿Quieres que sonría, llore, se sienta orgulloso o quiera bailar? Dínoslo tal cual.":"Do you want them to smile, cry, feel proud, or want to dance? Tell us directly.","Ya casi está.":"Almost there.","Tu correo identifica el pedido y será el canal principal para la entrega y cualquier aclaración.":"Your email identifies the order and will be the main channel for delivery and any questions.","← Editar mi brief":"← Edit my brief","ÚLTIMO REPASO":"FINAL REVIEW","Tu historia ya está armada.":"Your story is ready.","Revisa lo esencial, elige si quieres algún extra y envía el pedido. No te cobraremos nada hasta que el checkout esté conectado y veas el total final claramente.":"Review the essentials, choose any extras, and submit the order. You will not be charged until checkout is connected and you clearly see the final total.","✓ Brief guardado":"✓ Brief saved","✓ Moneda visible":"✓ Regional price locked","✓ 1 revisión incluida":"✓ 1 revision included","BRIEF / 01":"BRIEF / 01","SONALZA SESSION":"SONALZA SESSION","Tu historia":"Your story","Incluye 1 revisión":"Includes 1 revision","Si la dirección se aleja de manera importante de lo que nos compartiste, corregiremos el enfoque dentro del alcance de la revisión incluida.":"If the direction significantly misses what you shared, we will correct the approach within the included revision.","ORDEN / 02":"ORDER / 02","PERSONALIZA":"CUSTOMIZE","Tu pedido":"Your order","POR TIEMPO LIMITADO":"LIMITED TIME","Canción personalizada":"Custom Song","Precio promocional aplicado":"Promotional price applied","Descuento de lanzamiento":"Launch discount","Recuerdo Premium":"Premium Keepsake","Letra diseñada + tarjeta con QR + portada personalizada.":"Designed lyrics + QR card + custom cover.","Entrega prioritaria":"Priority delivery","Tu pedido entra a la fila de producción prioritaria.":"Your order enters the priority production queue.","Video vertical con letra":"Vertical lyric video","Preparado para Reels, TikTok y Shorts.":"Prepared for Reels, TikTok, and Shorts.","Segunda versión":"Second version","La misma historia con una segunda dirección musical.":"The same story with a second musical direction.","Total":"Total","Moneda del pedido":"Order currency","¿Qué pasa al enviarlo?":"What happens when you submit?","Registramos tu brief con un número de pedido y lo enviamos a SONALZA. El checkout de pago se conectará como siguiente integración; mientras tanto no se realiza ningún cargo.":"We register your brief with an order number and send it to SONALZA. Payment checkout will be connected in the next integration; until then no charge is made.","Recibimos tu brief":"We receive your brief","Tu historia queda asociada a un número de pedido.":"Your story is linked to an order number.","Confirmamos y producimos":"We confirm and produce","Revisamos la dirección antes de preparar la canción.":"We review the direction before preparing the song.","Entrega digital":"Digital delivery","Recibes tu canción y puedes usar la revisión incluida.":"You receive your song and can use the included revision.","Enviar mi pedido →":"Submit my order →","¿Qué te hizo dudar?":"What made you hesitate?","El total es más alto de lo esperado.":"The total is higher than expected.","No veo la opción que prefiero.":"I do not see my preferred option.","Dudas del producto":"Product concerns","Necesito entender mejor lo que recibo.":"I need to better understand what I receive.","Problema técnico":"Technical issue","Algo no funcionó como esperaba.":"Something did not work as expected.","Todavía no estoy listo para ordenar.":"I am not ready to order yet.","Mi motivo es diferente.":"My reason is different.","Para":"For","Ocasión":"Occasion","Estilo":"Style","Idioma":"Language","Correo":"Email","Sin nombre":"No name","Sin especificar":"Not specified","← Volver a servicios":"← Back to services","MÚSICA PARA NEGOCIOS":"MUSIC FOR BUSINESS","Haz que tu marca también tenga sonido.":"Give your brand a sound of its own.","Cuéntanos qué vendes, a quién quieres llegar y dónde se escuchará la pieza. Te responderemos con la dirección recomendada para tu proyecto.":"Tell us what you sell, who you want to reach, and where the piece will be heard. We will respond with the recommended direction for your project.","BRIEF COMERCIAL":"BUSINESS BRIEF","Jingle, hook o música de marca.":"Jingle, hook, or brand music.","Ideal para anuncios, contenido social, campañas, producto, radio, YouTube y piezas cortas para TikTok o Reels.":"Ideal for ads, social content, campaigns, products, radio, YouTube, and short pieces for TikTok or Reels.","Dirección creativa según marca":"Creative direction based on your brand","Opciones vocales e instrumentales":"Vocal and instrumental options","Versiones cortas según proyecto":"Short versions based on project","Licencia definida antes de producir":"License defined before production","Tu nombre":"Your name","Nombre del negocio":"Business name","Tipo de proyecto":"Project type","Selecciona…":"Select…","Jingle completo":"Full jingle","Hook para redes":"Social media hook","Música para anuncio":"Music for an ad","Identidad sonora":"Sonic identity","Presupuesto aproximado":"Approximate budget","Prefiero hablarlo":"I prefer to discuss it","Cuéntanos qué necesitas":"Tell us what you need","Enviar solicitud →":"Submit request →","Enviando…":"Sending…","SOLICITUD RECIBIDA":"REQUEST RECEIVED","Ya llegó a SONALZA.":"SONALZA has received it.","Volver al inicio →":"Back to home →","BRIEF RECIBIDO":"BRIEF RECEIVED","Tu historia ya llegó a SONALZA.":"Your story has reached SONALZA.","Guardamos los datos de tu pedido. Conserva este número como referencia:":"We saved your order details. Keep this number as your reference:","Cuando activemos el checkout, esta misma página podrá continuar directamente al pago. Por ahora, el equipo de SONALZA recibe tu información para seguimiento.":"When checkout is activated, this page will be able to continue directly to payment. For now, the SONALZA team receives your information for follow-up.","Volver a SONALZA →":"Back to SONALZA →"};
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
    'Ejemplo: Que se vea completa la cara, el sombrero y el nombre Derek.':'Example: Make sure the full face, the hat, and the name Derek remain visible.'
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
    coverImageName: ''
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
      '.hero-copy', '.hero-media', '.trust-strip-grid > div', '.quick-head', '.quick-card',
      '.manifest-kicker', '.manifest-copy', '.manifest-points article', '.latin-copy', '.latin-values article',
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
    const params = new URLSearchParams(location.search);
    const productParam = params.get('product');
    const genreParam = params.get('genre');
    const occasionParam = params.get('occasion');
    const relationParam = params.get('relation');
    if (productParam === 'corrido') { data.product = 'corrido'; data.genero = 'Corrido'; }
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

    const optionButtons = (items, selected, key) => `
      <div class="option-grid">
        ${items.map(item => `<button type="button" class="option ${selected === item ? 'selected' : ''}" data-key="${key}" data-value="${item}">${item}</button>`).join('')}
      </div>`;

    const steps = [
      () => `
        <div class="smallcaps">Paso 1</div>
        <h1>¿Para quién es esta canción?</h1>
        <p class="sub">Elige la relación más cercana. Si no aparece exactamente, selecciona “Otro”.</p>
        <div class="why-box"><strong>¿Por qué te lo preguntamos?</strong><span>La relación cambia el tono de la letra y la forma de contar la historia.</span></div>
        ${optionButtons(['Esposo','Esposa','Pareja','Novio','Novia','Papá','Mamá','Hijo','Hija','Abuelo/a','Hermano/a','Amigo/a','Para mí','Otro'], data.paraQuien, 'paraQuien')}`,
      () => `
        <div class="smallcaps">Paso 2</div>
        <h1>¿Cómo se llama?</h1>
        <p class="sub">Escribe el nombre tal como quieres que aparezca o se cante.</p>
        <div class="why-box"><strong>Ejemplo</strong><span>“José”, “Mamá Lupita”, “Mi viejo”, “César”. Usa la forma que realmente le dices.</span></div>
        <div class="form-box"><label for="nombre">Nombre</label><input id="nombre" maxlength="60" placeholder="Ejemplo: Julián" value="${escapeHtml(data.nombre)}"><div class="field-meta"><span>Así lo usaremos dentro del brief.</span><span id="nombreCount">${data.nombre.length}/60</span></div></div>`,
      () => `
        <div class="smallcaps">Paso 3</div>
        <h1>¿Cuál es la ocasión?</h1>
        <p class="sub">Elige la ocasión que mejor explica por qué estás creando esta canción.</p>
        <div class="why-box"><strong>No tiene que ser una fecha especial.</strong><span>“Porque sí”, “Te amo” o “Gracias” también pueden producir canciones muy fuertes.</span></div>
        ${optionButtons(['Porque sí','Te amo','Cumpleaños','Aniversario','Te extraño','Gracias','Perdón','Boda','Amistad','En memoria','Logro especial','Propuesta','Jubilación','Graduación','Otra ocasión'], data.ocasion, 'ocasion')}`,
      () => `
        <div class="smallcaps">Paso 4</div>
        <h1>Elige el estilo de la canción</h1>
        <p class="sub">Elige la dirección musical. Si no estás seguro, “Sorpréndeme” nos deja proponerla.</p>
        <div class="why-box"><strong>Piensa en la persona que la recibirá.</strong><span>No elijas solo tu género favorito: elige el que más conectaría con esa historia.</span></div>
        ${optionButtons(['Corrido','Banda','Norteño','Cumbia','Mariachi','Duranguense','Huapango','Sierreño','Pop Latino','Reguetón','Balada','Sorpréndeme'], data.genero, 'genero')}
        <div class="dual-grid">
          <div><div class="helper" style="text-align:center;margin-bottom:10px">Voz</div>${optionButtons(['Masculina','Femenina','Sorpréndeme'], data.voz, 'voz')}</div>
          <div><div class="helper" style="text-align:center;margin-bottom:10px">Idioma de la canción</div>${optionButtons(['Español','Inglés','Bilingüe'], data.idioma, 'idioma')}</div>
        </div>`,
      () => `
        <div class="smallcaps">Paso 5</div>
        <h1>¿Qué hace especial a ${escapeHtml(data.nombre) || 'esta persona'}?</h1>
        <p class="sub">Descríbela con tus propias palabras. Una o dos frases claras suelen dar mejores resultados.</p>
        <div class="prompt-chips"><span>Cómo es</span><span>Qué admiras</span><span>Qué hace por ustedes</span></div>
        <div class="form-box"><label for="cualidades">Sus mejores cualidades</label><textarea id="cualidades" maxlength="700" placeholder="Ejemplo: Siempre ha cuidado de nuestra familia, tiene un gran sentido del humor y nunca deja que nadie se rinda.">${escapeHtml(data.cualidades)}</textarea><div class="field-meta"><span>Escribe natural. No necesitas rimar.</span><span id="cualidadesCount">${data.cualidades.length}/700</span></div></div>`,
      () => `
        <div class="smallcaps">Paso 6</div>
        <h1>Comparte un recuerdo inolvidable</h1>
        <p class="sub">Los detalles específicos hacen que la canción se sienta verdaderamente personal.</p>
        <div class="prompt-chips"><span>Un lugar</span><span>Una anécdota</span><span>Una frase</span><span>Un momento</span></div>
        <div class="form-box"><label for="recuerdo">Momento especial</label><textarea id="recuerdo" maxlength="900" placeholder="Ejemplo: Nos conocimos trabajando en Anaheim. Siempre dice ‘primero la familia’. El viaje a Chihuahua en 2018 fue cuando…">${escapeHtml(data.recuerdo)}</textarea><div class="field-meta"><span>Entre más específico, menos genérica se sentirá la canción.</span><span id="recuerdoCount">${data.recuerdo.length}/900</span></div></div>`,
      () => `
        <div class="smallcaps">Paso 7</div>
        <h1>¿Qué quieres que sienta al escucharla?</h1>
        <p class="sub">Dinos el mensaje que debe quedar en el corazón de quien la reciba.</p>
        <div class="dual-grid">
          <div class="form-box"><label for="frase">Frase que te gustaría escuchar <span class="helper">(opcional)</span></label><textarea id="frase" maxlength="300" placeholder="Ejemplo: Gracias por cruzar fronteras por nosotros.">${escapeHtml(data.frase)}</textarea><div class="field-meta"><span>Puede ser una frase familiar o algo que tú quieres decirle.</span><span id="fraseCount">${data.frase.length}/300</span></div></div>
          <div class="form-box"><label for="emocion">Mensaje principal</label><textarea id="emocion" maxlength="700" placeholder="Ejemplo: Quiero que entienda que todo su esfuerzo valió la pena y que estamos orgullosos de él.">${escapeHtml(data.emocion)}</textarea><div class="field-meta"><span>Piensa en cómo quieres que se sienta al terminar.</span><span id="emocionCount">${data.emocion.length}/700</span></div></div>
        </div>`,
      () => `
        <div class="smallcaps">Paso final</div>
        <h1>¿A dónde enviamos tu canción?</h1>
        <p class="sub">Usaremos estos datos para identificar tu pedido y comunicarnos contigo sobre la entrega.</p>
        <div class="privacy-note"><span>🔒</span><div><strong>Tu historia es privada.</strong><p>No necesitas publicar nada para crear tu canción.</p></div></div>
        <div class="dual-grid contact-grid">
          <div class="form-box compact-field" id="emailField"><label for="email">Correo electrónico</label><input type="email" id="email" inputmode="email" autocomplete="email" placeholder="tu@correo.com" value="${escapeHtml(data.email)}"><div id="emailValidation" class="field-validation" hidden></div></div>
          <div class="form-box compact-field"><label for="telefono">Teléfono <span class="helper">(opcional)</span></label><input id="telefono" inputmode="tel" autocomplete="tel" placeholder="(555) 555-5555" value="${escapeHtml(data.telefono)}"><div class="helper">Más adelante podremos usarlo para avisos de entrega por mensaje de texto.</div></div>
        </div>`
    ];

    function escapeHtml(value='') {
      return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    }

    function bindOptions() {
      question.querySelectorAll('.option').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          data[key] = btn.dataset.value;
          save(data);
          question.querySelectorAll(`.option[data-key="${key}"]`).forEach(option => option.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
    }

    function collectInputs() {
      const ids = ['nombre','cualidades','recuerdo','frase','emocion','email','telefono'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value.trim();
      });
      save(data);
    }

    const EMAIL_DOMAIN_FIXES = {
      'gmil.com':'gmail.com',
      'gmai.com':'gmail.com',
      'gmail.co':'gmail.com',
      'gmal.com':'gmail.com',
      'gnail.com':'gmail.com',
      'hotnail.com':'hotmail.com',
      'hotmai.com':'hotmail.com',
      'hotmail.co':'hotmail.com',
      'outlok.com':'outlook.com',
      'outloo.com':'outlook.com',
      'icloud.co':'icloud.com',
      'iclod.com':'icloud.com',
      'yaho.com':'yahoo.com',
      'yahoo.co':'yahoo.com'
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
      if (!clean) {
        return { valid:false, code:'empty', message: currentLanguage === 'en' ? 'Enter a valid email address to continue.' : 'Escribe un correo electrónico válido para continuar.' };
      }
      const suggestion = getEmailSuggestion(clean);
      if (suggestion && suggestion !== clean) {
        return {
          valid:false,
          code:'suggestion',
          suggestion,
          message: currentLanguage === 'en' ? `Did you mean ${suggestion}?` : `¿Quisiste decir ${suggestion}?`
        };
      }
      const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!basicPattern.test(clean)) {
        return { valid:false, code:'format', message: currentLanguage === 'en' ? 'Enter a complete email, for example name@gmail.com.' : 'Escribe un correo completo, por ejemplo nombre@gmail.com.' };
      }
      return { valid:true, message:'' };
    }

    function bindEmailValidation() {
      const emailInput = document.getElementById('email');
      const emailField = document.getElementById('emailField');
      const emailValidation = document.getElementById('emailValidation');
      if (!emailInput || !emailField || !emailValidation) return;

      const renderState = () => {
        const value = emailInput.value.trim();
        data.email = value;
        save(data);
        if (!value) {
          emailField.classList.remove('invalid');
          emailValidation.hidden = true;
          emailValidation.innerHTML = '';
          return;
        }
        const result = validateEmailValue(value);
        if (result.valid) {
          emailField.classList.remove('invalid');
          emailValidation.hidden = true;
          emailValidation.innerHTML = '';
          return;
        }
        emailField.classList.add('invalid');
        if (result.suggestion) {
          const label = currentLanguage === 'en' ? `Correct to ${result.suggestion}` : `Corregir a ${result.suggestion}`;
          emailValidation.innerHTML = `${result.message} <button type="button" class="email-suggestion" data-email-suggestion="${result.suggestion}">${label}</button>`;
        } else {
          emailValidation.textContent = result.message;
        }
        emailValidation.hidden = false;
      };

      emailInput.addEventListener('input', renderState);
      emailInput.addEventListener('blur', renderState);
      emailValidation.addEventListener('click', e => {
        const button = e.target.closest('[data-email-suggestion]');
        if (!button) return;
        emailInput.value = button.dataset.emailSuggestion || '';
        renderState();
        emailInput.focus();
      });
      renderState();
    }

    function formatPhoneValue(value='') {
      const digits = String(value || '').replace(/\D/g,'').slice(0,11);
      if (!digits) return '';
      if (digits.length === 11 && digits.startsWith('1')) {
        const a = digits.slice(1,4), b = digits.slice(4,7), c = digits.slice(7,11);
        return `+1 (${a}) ${b}-${c}`;
      }
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
    }

    function bindPhoneFormatting() {
      const phoneInput = document.getElementById('telefono');
      if (!phoneInput) return;
      const apply = () => {
        const formatted = formatPhoneValue(phoneInput.value);
        phoneInput.value = formatted;
        data.telefono = formatted;
        save(data);
      };
      phoneInput.addEventListener('input', apply);
      phoneInput.addEventListener('blur', apply);
      if (phoneInput.value) apply();
    }

    function isValid() {
      collectInputs();
      const required = [
        () => !!data.paraQuien,
        () => data.nombre.length >= 2,
        () => !!data.ocasion,
        () => !!data.genero && !!data.voz && !!data.idioma,
        () => data.cualidades.length >= 10,
        () => data.recuerdo.length >= 10,
        () => data.emocion.length >= 8,
        () => validateEmailValue(data.email).valid
      ];
      return required[step]();
    }

    function showError() {
      question.querySelector('.error')?.remove();
      const div = document.createElement('div');
      div.className = 'error';
      if (step === 7) {
        const result = validateEmailValue(data.email);
        div.textContent = result.message || (currentLanguage === 'en' ? 'Enter a valid email address to continue.' : 'Escribe un correo electrónico válido para continuar.');
        bindEmailValidation();
        document.getElementById('email')?.focus();
      } else {
        div.textContent = currentLanguage === 'en' ? 'Complete this information to continue.' : 'Completa esta información para continuar.';
      }
      question.appendChild(div);
    }

    const stepTips = [
      ['Empieza simple.','La relación nos ayuda a definir cercanía, lenguaje y tono emocional.'],
      ['Usa el nombre real.','Escribe cómo le dices de verdad. Ese detalle puede hacer que la canción se sienta mucho más personal.'],
      ['Define el motivo.','La ocasión nos ayuda a decidir qué debe quedar al frente: celebración, amor, gratitud, homenaje o memoria.'],
      ['El sonido también cuenta la historia.','Un corrido narra distinto a una cumbia. Elige pensando en quién recibirá la canción.'],
      ['No busques palabras perfectas.','Escribe como hablas. Nosotros nos encargamos de convertir esas ideas en una letra musical.'],
      ['Los detalles pequeños son oro.','Lugares, apodos, frases y momentos concretos son lo que evita que la canción se sienta genérica.'],
      ['Piensa en la última sensación.','¿Quieres que sonría, llore, se sienta orgulloso o quiera bailar? Dínoslo tal cual.'],
      ['Ya casi está.','Tu correo identifica el pedido y será el canal principal para la entrega y cualquier aclaración.']
    ];

    function bindCounters(){
      const fields = [['nombre',60],['cualidades',700],['recuerdo',900],['frase',300],['emocion',700]];
      fields.forEach(([id,max])=>{
        const el=document.getElementById(id); const count=document.getElementById(id+'Count');
        if(!el||!count) return;
        const update=()=>{ count.textContent=`${el.value.length}/${max}`; };
        el.addEventListener('input',update); update();
      });
    }

    function render() {
      question.innerHTML = steps[step]();
      translateDOM(question);
      bindOptions();
      bindCounters();
      if (step === steps.length - 1) {
        bindEmailValidation();
        bindPhoneFormatting();
      }
      if (railTipTitle && railTipText) {
        railTipTitle.textContent = translatePhrase(stepTips[step][0]);
        railTipText.textContent = translatePhrase(stepTips[step][1]);
      }
      const pct = Math.round(((step + 1) / steps.length) * 100);
      stepLabel.textContent = currentLanguage === 'en' ? (step === 7 ? 'Final step' : `Step ${step + 1} of ${steps.length}`) : (step === 7 ? 'Paso final' : `Paso ${step + 1} de ${steps.length}`);
      pctLabel.textContent = currentLanguage === 'en' ? `${pct}% complete` : `${pct}% completado`;
      bar.style.width = `${pct}%`;
      backBtn.disabled = step === 0;
      nextBtn.textContent = currentLanguage === 'en' ? (step === 7 ? 'Review my order →' : 'Next →') : (step === 7 ? 'Revisar mi pedido →' : 'Siguiente →');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', () => {
      if (!isValid()) return showError();
      if (step < steps.length - 1) { step += 1; render(); }
      else location.href = 'order.html';
    });
    backBtn.addEventListener('click', () => {
      collectInputs();
      if (step > 0) { step -= 1; render(); }
    });

    render();
    setupExitIntent();
  }

  if (page === 'business') {
    const form = document.getElementById('businessForm');
    const status = document.getElementById('businessStatus');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=\"submit\"]');
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
        if (!r.ok || !result.ok) throw new Error(result.error || 'No pudimos enviar la solicitud.');
        form.innerHTML = `<div class=\"business-success\"><div class=\"eyebrow\">SOLICITUD RECIBIDA</div><h2>Ya llegó a SONALZA.</h2><p>Referencia <strong>${result.leadId}</strong>. Te responderemos usando el correo que nos compartiste.</p><a href=\"index.html\" class=\"btn btn-primary\">Volver al inicio →</a></div>`;
      } catch(err) {
        if (status) { status.textContent=err.message; status.className='submit-status error-status'; }
        btn.disabled=false; btn.textContent=original;
      }
    });
  }

  if (page === 'order') {
    const data = load();
    const briefRows = document.getElementById('briefRows');
    const rows = [
      [translatePhrase('Para'), `${data.nombre || translatePhrase('Sin nombre')} (${translatePhrase(data.paraQuien || 'Sin especificar')})`],
      [translatePhrase('Ocasión'), translatePhrase(data.ocasion || 'Sin especificar')],
      [translatePhrase('Estilo'), translatePhrase(data.genero || 'Sin especificar')],
      [translatePhrase('Voz'), translatePhrase(data.voz || 'Sin especificar')],
      [translatePhrase('Idioma'), translatePhrase(data.idioma || 'Español')],
      [translatePhrase('Correo'), data.email || translatePhrase('Sin especificar')]
    ];
    briefRows.innerHTML = rows.map(([label, value]) => `<div class="brief-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('');

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
            data.coverImageName = '';
            save(data);
            if (fileName) { fileName.hidden = true; fileName.textContent = ''; }
            if (previewWrap) previewWrap.hidden = true;
            if (previewImage) previewImage.removeAttribute('src');
            return;
          }
          data.coverImageName = file.name;
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

    const updateTotal = () => {
      const productKey = data.product === 'corrido' ? 'corrido' : 'song';
      const base = PRICING[productKey][currentCurrency];
      let total = base;
      const productLabel = document.getElementById('orderProductLabel');
      if (productLabel) productLabel.textContent = productKey === 'corrido' ? translatePhrase('Corrido de Tu Vida') : translatePhrase('Canción personalizada');
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
      if (checkoutBtn) checkoutBtn.textContent = `${currentLanguage === 'en' ? 'Submit order' : 'Enviar pedido'} · ${formatMoney(total)} →`;
    };

    bindCoverAddonInputs();
    addons.forEach(a => a.addEventListener('change', updateTotal));
    window.addEventListener('sonalza:currencychange', updateTotal);
    checkoutBtn?.addEventListener('click', async () => {
      const original = checkoutBtn.textContent;
      const statusEl = document.getElementById('submitStatus');
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = currentLanguage === 'en' ? 'Registering your order…' : 'Registrando tu pedido…';
      if (statusEl) { statusEl.textContent = ''; statusEl.className = 'submit-status'; }
      try {
        const chosenAddons = addons.filter(a=>a.checked).map(a=>a.dataset.key);
        const utmParams = new URLSearchParams(location.search);
        const utm = {};
        ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{ if(utmParams.get(k)) utm[k]=utmParams.get(k); });
        const response = await fetch('/api/submit-order', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({draft:data,region:currentRegion,language:currentLanguage,currency:currentCurrency,detectedRegion,regionOverride:localStorage.getItem(REGION_OVERRIDE_KEY)==='1',addons:chosenAddons,page:location.href,referrer:document.referrer,utm})
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
    setupExitIntent();
  }

  setupRevealAnimations();
  setupLocalePicker();
})();
