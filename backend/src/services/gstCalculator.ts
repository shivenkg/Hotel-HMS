import { FolioItem } from '../types/index.js';

export interface GstBreakdown {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  itemized: Array<FolioItem & { cgst: number; sgst: number; igst: number }>;
}

export class GstTaxCalculator {
  /**
   * Determine GST slab for room tariffs
   * Up to ₹7,500/night -> 12% (6% CGST + 6% SGST)
   * ₹7,500/night and above -> 18% (9% CGST + 9% SGST)
   */
  public static getRoomGstRate(ratePerNight: number): number {
    return ratePerNight >= 7500 ? 18 : 12;
  }

  /**
   * Compute comprehensive taxes on all folio items
   * isInterState: if true, levy IGST instead of split CGST + SGST
   */
  public static computeFolioTaxes(
    items: FolioItem[],
    discount: number = 0,
    isInterState: boolean = false
  ): GstBreakdown {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const itemized = items.map(item => {
      subtotal += item.amount;
      const taxRate = item.taxRatePercent / 100;
      const taxTotalForItem = Math.round(item.amount * taxRate * 100) / 100;

      let itemCgst = 0;
      let itemSgst = 0;
      let itemIgst = 0;

      if (isInterState) {
        itemIgst = taxTotalForItem;
        igst += itemIgst;
      } else {
        itemCgst = Math.round((taxTotalForItem / 2) * 100) / 100;
        itemSgst = Math.round((taxTotalForItem - itemCgst) * 100) / 100;
        cgst += itemCgst;
        sgst += itemSgst;
      }

      return {
        ...item,
        cgst: itemCgst,
        sgst: itemSgst,
        igst: itemIgst
      };
    });

    const totalTax = isInterState ? igst : cgst + sgst;
    const grandTotal = Math.max(0, subtotal - discount + totalTax);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      itemized
    };
  }
}
