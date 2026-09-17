const OPENAI_MODEL = process.env.OPENAI_PRODUCTION_MODEL || 'gpt-5.6-sol';

const ARTISTS = {
  ALTUNO: {
    artist: 'ALTUNO',
    vocal_gender: 'Male',
    voice_name: 'ALTUNO MASTER v1',
    voice_url: 'https://suno.com/voice/ba8a26a0-7920-4bde-9d75-30b90af74e48',
    voice_version: 'v1',
    approval_status: 'APPROVED'
  },
  NARELI: {
    artist: 'NARELI',
    vocal_gender: 'Female',
    voice_name: 'NARELI MASTER v1',
    voice_url: 'https://suno.com/voice/22999b7b-abe1-42fb-be83-5240e1f296b9',
    voice_version: 'v1',
    approval_status: 'APPROVED'
  }
};

function configured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function countChars(value) {
  return Array.from(String(value || '')).length;
}

function normalizeArtistChoice(value) {
  const raw = String(value || '').trim().toUpperCase();
  if (raw.includes('NARELI') || raw.includes('FEMALE') || raw.includes('MUJER')) return 'NARELI';
  if (raw.includes('ALTUNO') || raw.includes('MALE') || raw.includes('HOMBRE')) return 'ALTUNO';
  return null;
}

function productRules(order) {
  const product = String(order.product || '').toLowerCase();
  if (product === 'corrido') {
    return {
      product_label: 'Corrido de una Vida',
      duration_rule: 'Normally 3 to 6 minutes. Expand the narrative only when the customer requested a longer duration.'
    };
  }
  return {
    product_label: 'Personalized Song',
    duration_rule: 'Normally 2 to 3 minutes. Keep the song complete but concise and avoid unnecessary padding.'
  };
}

function buildPrompt(order) {
  const brief = order.brief || {};
  const artistKey = normalizeArtistChoice(brief.voz);
  const artist = artistKey ? ARTISTS[artistKey] : null;
  const product = productRules(order);

  return `You are SONALZA Production Director. Create one production-ready V1 song pack for a paid customer order.\n\nPRIVACY / DATA MINIMIZATION\n- Use only the creative fields supplied below.\n- No customer email, phone number, address, billing data, payment data, Stripe identifiers, or other operational customer data is included or needed.\n\nNON-NEGOTIABLE WORKFLOW RULES\n- This pack is for HUMAN REVIEW. Never mark it approved for Suno.\n- APPROVAL_STATUS must be PENDING.\n- PRODUCTION_STATUS after generation is PRODUCTION_PACK_READY.\n- Never invent customer facts. If a detail is absent, omit it creatively rather than fabricating it.\n- Preserve names and requested facts exactly.\n- Lyrics maximum: 5,000 total characters, counting every letter, number, space, punctuation mark, bracket and line break.\n- SUNO_STYLE maximum: 1,000 total characters under the same counting rule.\n- Do not target the maximum. Match lyric density to requested duration, tempo, genre and arrangement.\n- 5,000 lyric characters is only an absolute ceiling for unusually long songs that could approach roughly seven minutes.\n- ${product.duration_rule}\n- Before returning QA PASS, ensure lyrics and style are comfortably inside their limits.\n- SUNO_STYLE must describe music production, arrangement, vocal feel and sonic direction.\n- VARIETY must be exactly one of: OFF, NORMAL, HIGH, EXTRA, MAX. Use NORMAL by default unless the creative goal clearly needs otherwise.\n- WEIRDNESS is an integer percentage from 0 to 100.\n- STYLE_INFLUENCE is an integer percentage from 0 to 100.\n- AUDIO_INFLUENCE is an integer percentage from 0 to 100. Use 0 when no reference/input audio is being used.\n- MAX_MODE must be ON or OFF.\n- MY_TASTE must be ON or OFF.\n- MODEL must be Suno v6.\n- Avoid melodrama, victimization, filler and generic cliches when the customer story supports something more specific.\n- Lyrics must be singable, professionally structured and naturally phrased for the chosen genre.\n- Do not mention SONALZA inside the song unless the customer explicitly requested that.\n\nCREATIVE ORDER DATA\nORDER_ID: ${order.order_id || ''}\nPRODUCT: ${product.product_label}\nSITE_LANGUAGE: ${order.language || ''}\nSONG_LANGUAGE: ${brief.idioma || ''}\nRECIPIENT_RELATION: ${brief.paraQuien || ''}\nRECIPIENT_NAME: ${brief.nombre || ''}\nOCCASION: ${brief.ocasion || ''}\nGENRE: ${brief.genero || ''}\nARTIST_CHOICE: ${brief.voz || ''}\nTARGET_DURATION: ${brief.duracion || ''}\nQUALITIES: ${brief.cualidades || ''}\nMEMORY: ${brief.recuerdo || ''}\nKEY_PHRASE: ${brief.frase || ''}\nMAIN_MESSAGE: ${brief.emocion || ''}\nROOTS: ${brief.raices || ''}\nJOURNEY: ${brief.trayectoria || ''}\nKEY_PEOPLE: ${brief.personasClave || ''}\nCHALLENGES: ${brief.retos || ''}\nACHIEVEMENTS: ${brief.logros || ''}\nLEGACY: ${brief.legado || ''}\nADDONS: ${JSON.stringify(order.addons || [])}\n\nAPPROVED ARTIST PROFILE\n${artist ? JSON.stringify(artist, null, 2) : 'No explicit approved artist was selected. Choose ALTUNO for an appropriate male voice or NARELI for an appropriate female voice based only on the creative order context, and explain the selection.'}\n\nReturn only the structured production pack requested by the schema.`;
}

const schema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'artist','voice_name','voice_url','song_title','song_language','genre','subgenre','mood','energy','target_duration','bpm',
    'lyrics','suno_style','exclude_styles','suno_settings','must_preserve_details','qa_checklist','human_review_required',
    'review_notes','approval_status','revision_reason','parent_version','prompt_version','qa_status','production_recommendation'
  ],
  properties: {
    artist: { type: 'string' },
    voice_name: { type: 'string' },
    voice_url: { type: 'string' },
    song_title: { type: 'string' },
    song_language: { type: 'string' },
    genre: { type: 'string' },
    subgenre: { type: 'string' },
    mood: { type: 'string' },
    energy: { type: 'string' },
    target_duration: { type: 'string' },
    bpm: { type: 'integer', minimum: 40, maximum: 220 },
    lyrics: { type: 'string' },
    suno_style: { type: 'string' },
    exclude_styles: { type: 'string' },
    suno_settings: {
      type: 'object',
      additionalProperties: false,
      required: ['model','max_mode','variety','weirdness','style_influence','audio_influence','my_taste','target_duration'],
      properties: {
        model: { type: 'string', enum: ['Suno v6'] },
        max_mode: { type: 'string', enum: ['ON','OFF'] },
        variety: { type: 'string', enum: ['OFF','NORMAL','HIGH','EXTRA','MAX'] },
        weirdness: { type: 'integer', minimum: 0, maximum: 100 },
        style_influence: { type: 'integer', minimum: 0, maximum: 100 },
        audio_influence: { type: 'integer', minimum: 0, maximum: 100 },
        my_taste: { type: 'string', enum: ['ON','OFF'] },
        target_duration: { type: 'string' }
      }
    },
    must_preserve_details: { type: 'array', items: { type: 'string' } },
    qa_checklist: { type: 'array', items: { type: 'string' } },
    human_review_required: { type: 'boolean' },
    review_notes: { type: 'string' },
    approval_status: { type: 'string', enum: ['PENDING'] },
    revision_reason: { type: 'string' },
    parent_version: { type: 'string' },
    prompt_version: { type: 'string', enum: ['V1'] },
    qa_status: { type: 'string', enum: ['PASS','FAIL'] },
    production_recommendation: { type: 'string', enum: ['Generate','Revise'] }
  }
};

async function callOpenAI(order) {
  if (!configured()) throw new Error('OPENAI_API_KEY is not configured');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      reasoning: { effort: 'medium' },
      input: buildPrompt(order),
      text: {
        format: {
          type: 'json_schema',
          name: 'sonalza_production_pack',
          strict: true,
          schema
        }
      }
    })
  });

  const raw = await response.text();
  let payload;
  try { payload = JSON.parse(raw); } catch (_) { throw new Error(`OpenAI returned invalid JSON (${response.status})`); }
  if (!response.ok) throw new Error(`OpenAI production generation failed (${response.status}): ${JSON.stringify(payload).slice(0, 700)}`);

  const text = payload.output_text || (payload.output || [])
    .flatMap(item => item.content || [])
    .map(part => part.text || '')
    .filter(Boolean)
    .join('');
  if (!text) throw new Error('OpenAI returned no production pack text');

  let pack;
  try { pack = JSON.parse(text); } catch (_) { throw new Error('OpenAI production pack was not valid JSON'); }

  pack.lyrics_character_count = countChars(pack.lyrics);
  pack.suno_style_character_count = countChars(pack.suno_style);

  if (pack.lyrics_character_count > 5000) throw new Error(`Lyrics exceed 5000 characters (${pack.lyrics_character_count})`);
  if (pack.suno_style_character_count > 1000) throw new Error(`SUNO_STYLE exceeds 1000 characters (${pack.suno_style_character_count})`);
  if (pack.approval_status !== 'PENDING') throw new Error('Production pack must remain PENDING for human approval');

  if (pack.qa_status !== 'PASS' || pack.production_recommendation !== 'Generate') pack.human_review_required = true;

  pack.pack_snapshot = {
    schema_version: 'SONALZA_PRODUCTION_PACK_V1',
    generated_at: new Date().toISOString(),
    order_id: order.order_id,
    ...pack
  };

  return pack;
}

module.exports = {
  configured,
  ARTISTS,
  countChars,
  generate: callOpenAI
};
