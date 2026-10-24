import { ShippingOption } from '../types';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export interface AddressResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  isValid: boolean;
  error?: string;
}

/**
 * Formats a Brazilian currency value
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Masks input as Brazilian Phone: (11) 98765-4321
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Masks input as CEP: 00000-000
 */
export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

/**
 * Fetches Brazilian address using public ViaCEP API
 */
export async function fetchAddressByCep(rawCep: string): Promise<AddressResult> {
  const clean = rawCep.replace(/\D/g, '');
  if (clean.length !== 8) {
    return {
      cep: rawCep,
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      isValid: false,
      error: 'CEP deve conter 8 dígitos.',
    };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!response.ok) throw new Error('Falha ao consultar CEP');
    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return {
        cep: rawCep,
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        isValid: false,
        error: 'CEP não encontrado na base dos Correios.',
      };
    }

    return {
      cep: data.cep,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      isValid: true,
    };
  } catch (err) {
    return {
      cep: rawCep,
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      isValid: false,
      error: 'Não foi possível conectar ao serviço de CEP.',
    };
  }
}

/**
 * Calculates estimated shipping fees and deadlines via Correios & JadLog
 */
export function calculateShippingOptions(
  uf: string,
  subtotal: number
): ShippingOption[] {
  const state = uf.toUpperCase().trim();
  const isRJ = state === 'RJ';
  const isSP = state === 'SP';
  const isSoutheast = ['RJ', 'SP', 'MG', 'ES'].includes(state);
  const isSouth = ['PR', 'SC', 'RS'].includes(state);
  const isCentralWest = ['DF', 'GO', 'MT', 'MS'].includes(state);
  const isNortheast = ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'SE', 'PI'].includes(state);

  // Pricing calculations
  let pacBase = 22;
  let sedexBase = 32;
  let jadlogBase = 26;

  let pacDays = '4 a 7 dias úteis';
  let sedexDays = '1 a 2 dias úteis';
  let jadlogDays = '2 a 4 dias úteis';

  if (isRJ) {
    pacBase = 14;
    sedexBase = 19;
    jadlogBase = 18;
    pacDays = '2 a 4 dias úteis';
    sedexDays = '1 dia útil';
    jadlogDays = '1 a 2 dias úteis';
  } else if (isSP) {
    pacBase = 18;
    sedexBase = 25;
    jadlogBase = 22;
    pacDays = '3 a 5 dias úteis';
    sedexDays = '1 a 2 dias úteis';
    jadlogDays = '2 a 3 dias úteis';
  } else if (isSoutheast) {
    pacBase = 22;
    sedexBase = 30;
    jadlogBase = 25;
    pacDays = '3 a 6 dias úteis';
    sedexDays = '2 a 3 dias úteis';
    jadlogDays = '2 a 4 dias úteis';
  } else if (isSouth || isCentralWest) {
    pacBase = 28;
    sedexBase = 42;
    jadlogBase = 34;
    pacDays = '5 a 8 dias úteis';
    sedexDays = '2 a 4 dias úteis';
    jadlogDays = '3 a 5 dias úteis';
  } else if (isNortheast) {
    pacBase = 34;
    sedexBase = 52;
    jadlogBase = 40;
    pacDays = '6 a 10 dias úteis';
    sedexDays = '3 a 5 dias úteis';
    jadlogDays = '4 a 6 dias úteis';
  } else {
    // North
    pacBase = 44;
    sedexBase = 68;
    jadlogBase = 52;
    pacDays = '8 a 14 dias úteis';
    sedexDays = '4 a 7 dias úteis';
    jadlogDays = '5 a 9 dias úteis';
  }

  return [
    {
      id: 'sedex',
      name: 'Sedex Exclusif',
      carrier: 'Correios',
      price: sedexBase,
      deadline: sedexDays,
      description: 'Envio prioritário aéreo com embalagem acolchoada de alta proteção.',
    },
    {
      id: 'jadlog',
      name: 'JadLog Package Privé',
      carrier: 'JadLog',
      price: jadlogBase,
      deadline: jadlogDays,
      description: 'Transporte terrestre com seguro total, lacre inviolável e rastreamento ponto a ponto.',
    },
    {
      id: 'pac',
      name: 'PAC Mirage Standard',
      carrier: 'Correios',
      price: pacBase,
      deadline: pacDays,
      description: 'Envio oficial dos Correios com código de rastreamento e seguro contra avarias.',
    },
  ];
}
