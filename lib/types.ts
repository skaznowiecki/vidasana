export const CATEGORIES = [
  { id: "frutos-secos", label: "Frutos Secos" },
  { id: "mixes", label: "Mixes" },
  { id: "frutos-deshidratados", label: "Frutos Deshidratados" },
  { id: "granolas", label: "Granolas" },
  { id: "semillas", label: "Semillas" },
  { id: "natural-seed", label: "Natural Seed" },
  { id: "cereales", label: "Cereales" },
  { id: "legumbres", label: "Legumbres" },
  { id: "harinas", label: "Harinas" },
  { id: "levaduras", label: "Levaduras" },
  { id: "meraki", label: "Meraki" },
  { id: "cosmetica-natural", label: "Cosmética Natural" },
  { id: "pura-soap", label: "Pura Soap" },
  { id: "sri-sri", label: "Sri Sri" },
  { id: "nutriplus", label: "Nutriplus" },
  { id: "oasis-capilar-y-corporal", label: "Oasis Capilar Y Corporal" },
  { id: "oasis-aceites", label: "Oasis Aceites" },
  { id: "aceites-green-zac", label: "Aceites Green Zac" },
  { id: "tintura-madre", label: "Tintura Madre" },
  { id: "suplementos-dietarios-frasco-x-60-comprimidos", label: "SUPLEMENTOS DIETARIOS (FRASCO x 60 comprimidos)" },
  { id: "oasis-infuciones", label: "Oasis Infuciones" },
  { id: "productos-sin-sin-tacc-delicel", label: "Productos Sin T.A.C.C. Delicel" },
  { id: "waw-food", label: "Waw Food" },
  { id: "productos-dicomere", label: "Productos \"Dicomere\"" },
  { id: "productos-frams", label: "Productos \"Frams\"" },
  { id: "fideos", label: "Fideos" },
  { id: "snacks-y-copetin", label: "Snacks y Copetín" },
  { id: "miel-y-derivados", label: "Miel Y Derivados" },
  { id: "galletas-galletitas-tostadas", label: "Galletas / Galletitas / Tostadas" },
  { id: "confituras", label: "Confituras" },
  { id: "cuarto-creciente", label: "Cuarto Creciente" },
  { id: "arrope", label: "Arrope" },
  { id: "mermelada-savona-fit", label: "Mermelada \"Savona Fit\"" },
  { id: "dulce-de-leche", label: "Dulce de Leche" },
  { id: "especias", label: "Especias" },
  { id: "pampa-gourmet", label: "Pampa Gourmet" },
  { id: "dusen", label: "Dusen" },
  { id: "condimentos-la-parmesana", label: "Condimentos \"La Parmesana\"" },
  { id: "jugos", label: "Jugos" },
  { id: "aceites", label: "Aceites" },
  { id: "pastas-de-mani", label: "Pastas De Mani" },
  { id: "sales", label: "Sales" },
  { id: "yerbas", label: "Yerbas" },
  { id: "te", label: "Té" },
  { id: "sopas-y-caldos", label: "Sopas Y Caldos" },
  { id: "dulzura-natural-energy", label: "Dulzura Natural Energy" },
  { id: "ultra-tech-por-encargue", label: "Ultra Tech (Por Encargue!)" },
  { id: "vitatech-por-encargue", label: "Vitatech (Por Encargue!)" },
  { id: "suplementos", label: "Suplementos" },
  { id: "probioticos", label: "Probioticos" },
  { id: "endulzantes", label: "Endulzantes" },
  { id: "leches-vegetales", label: "Leches Vegetales" },
  { id: "algas", label: "Algas" },
  { id: "golosinas", label: "Golosinas" },
  { id: "productos-de-reposteria", label: "Productos De Reposteria" },
  { id: "veganis", label: "Veganis" },
  { id: "sagrada-madre", label: "Sagrada Madre" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type ProductUnit = "500gr" | "kg" | "unidad";

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description?: string;
  inStock?: boolean;
  price500gr?: number;
  priceKg?: number;
  unitLabel?: string;
  fixedPrice?: number;
}

export interface ProductVariant {
  unit: ProductUnit;
  unitLabel: string;
  unitPrice: number;
}

export interface CartItem {
  productId: string;
  name: string;
  unit: ProductUnit;
  unitLabel: string;
  unitPrice: number;
  quantity: number;
}
