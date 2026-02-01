export interface DeedItem {
  id: number;
  title: string;
  description: string | null;
  virtueText: string | null;

  // ✅ DÜZELTME: Veritabanından 'null' gelebileceği için '| null' ekledik
  deedPoints: number | null;
  intentionPoints: number | null;

  startRef: string | null;
  endRef: string | null;
  timeMask: string | null;

  statusId: number | null;
  categoryId: number | null;
  periodId: number | null;

  // İlişkili Tablolar (Nested Objects)
  status: {
    id: number;
    name: string;
    colorCode: string | null;
  } | null;

  category: {
    id: number;
    name: string;
  } | null;

  period: {
    id: number;
    code: string | null;
    title: string | null;
  } | null;

  // Ekstra Alanlar
  isAdded: boolean;
  createdAt: string;
  isNew?: number;
}
