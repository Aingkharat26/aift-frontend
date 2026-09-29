import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface AppErrorInfo {
  title: string;
  message: string;
  suggestion?: string;
  statusCode?: number;
  rawMessage?: string;
  canRetry?: boolean;
}

export type ErrorContext =
  | 'general'
  | 'transactions'
  | 'expenses'
  | 'income'
  | 'chat'
  | 'receipt'
  | 'voice'
  | 'budgets'
  | 'categories'
  | 'auth'
  | 'admin';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  /**
   * แปลง Error ใดๆ (HttpErrorResponse, Error, string) ให้เป็น AppErrorInfo ที่มีข้อความภาษาไทยเข้าใจง่าย
   */
  parse(err: any, context: ErrorContext = 'general'): AppErrorInfo {
    console.error(`[AppError][${context}]`, err);

    // กรณีเป็น String ธรรมดา
    if (typeof err === 'string') {
      return this.fromCustomString(err, context);
    }

    // กรณีเป็น HttpErrorResponse
    if (err instanceof HttpErrorResponse || (err && typeof err.status === 'number')) {
      return this.fromHttpError(err, context);
    }

    // กรณี Timeout
    if (err?.name === 'TimeoutError') {
      return {
        title: 'การเชื่อมต่อหมดเวลา (Timeout)',
        message: 'เซิร์ฟเวอร์ตอบสนองช้าเกินกว่าเวลาที่กำหนด',
        suggestion: 'หากเซิร์ฟเวอร์กำลังเริ่มต้นระบบ (Cold Start) กรุณารอสักครู่แล้วกดปุ่มลองใหม่อีกครั้ง',
        statusCode: 408,
        rawMessage: err?.message || 'TimeoutError',
        canRetry: true,
      };
    }

    // ข้อผิดพลาดระบบเสียง (SpeechRecognition)
    if (context === 'voice' || err?.error === 'no-speech' || err?.error === 'not-allowed') {
      return this.fromVoiceError(err);
    }

    // Default Fallback
    const raw = err?.message || err?.error?.message || JSON.stringify(err);
    return {
      title: 'เกิดข้อผิดพลาดในการดำเนินการ',
      message: 'ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้',
      suggestion: 'กรุณาลองใหม่อีกครั้ง หรือรีเฟรชหน้าเว็บหากปัญหายังคงอยู่',
      rawMessage: raw,
      canRetry: true,
    };
  }

  private fromHttpError(err: HttpErrorResponse | any, context: ErrorContext): AppErrorInfo {
    const status = err.status;
    const rawMsg =
      err.error?.message ||
      (typeof err.error === 'string' ? err.error : null) ||
      err.message ||
      `Status: ${status}`;

    // 0: Network Error / Server Down / CORS
    if (status === 0) {
      return {
        title: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ (Network Error)',
        message: 'ไม่สามารถเชื่อมต่อกับระบบ Backend ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์เปิดอยู่หรือไม่',
        suggestion: 'ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต หรือตรวจสอบสถานะเซิร์ฟเวอร์ (Docker/Backend)',
        statusCode: 0,
        rawMessage: rawMsg,
        canRetry: true,
      };
    }

    // 400: Bad Request
    if (status === 400) {
      return {
        title: 'ข้อมูลที่ส่งไม่ถูกต้อง (400 Bad Request)',
        message: this.mapBadRequestMessage(rawMsg, context),
        suggestion: 'กรุณาตรวจสอบความถูกต้องของข้อมูลที่กรอก แล้วลองใหม่อีกครั้ง',
        statusCode: 400,
        rawMessage: rawMsg,
        canRetry: false,
      };
    }

    // 401: Unauthorized
    if (status === 401) {
      return {
        title: 'เซสชันการใช้งานหมดอายุ (401 Unauthorized)',
        message: 'การเข้าสู่ระบบหมดอายุหรือไม่ได้รับอนุญาตให้เข้าถึงข้อมูลนี้',
        suggestion: 'กรุณาเข้าสู่ระบบใหม่อีกครั้งเพื่อเริ่มเซสชันใหม่ที่ปลอดภัย',
        statusCode: 401,
        rawMessage: rawMsg,
        canRetry: false,
      };
    }

    // 403: Forbidden
    if (status === 403) {
      return {
        title: 'ไม่มีสิทธิ์เข้าถึง (403 Forbidden)',
        message: 'บัญชีของคุณไม่มีสิทธิ์ในการดำเนินการส่วนนี้ (จำเป็นต้องใช้สิทธิ์ Admin หรือเจ้าของข้อมูล)',
        suggestion: 'หากต้องการเข้าถึงส่วนนี้ กรุณาติดต่อผู้ดูแลระบบ',
        statusCode: 403,
        rawMessage: rawMsg,
        canRetry: false,
      };
    }

    // 404: Not Found
    if (status === 404) {
      return {
        title: 'ไม่พบข้อมูลหรือบริการ (404 Not Found)',
        message: this.mapNotFoundMessage(context),
        suggestion: 'ข้อมูลอาจถูกลบไปแล้ว หรือยังไม่มีการเปิดใช้บริการนี้ในระบบ',
        statusCode: 404,
        rawMessage: rawMsg,
        canRetry: true,
      };
    }

    // 409: Conflict (Duplicate data)
    if (status === 409) {
      return {
        title: 'ข้อมูลนี้มีอยู่ในระบบแล้ว (409 Conflict)',
        message: this.mapConflictMessage(rawMsg, context),
        suggestion: 'กรุณาเปลี่ยนชื่อหรือข้อมูลที่ไม่ซ้ำกับรายการเดิม',
        statusCode: 409,
        rawMessage: rawMsg,
        canRetry: false,
      };
    }

    // 413: Payload Too Large
    if (status === 413) {
      return {
        title: 'ไฟล์มีขนาดใหญ่เกินกำหนด (413 Payload Too Large)',
        message: 'รูปภาพใบเสร็จหรือข้อมูลที่อัปโหลดมีขนาดใหญ่เกินกว่าที่ระบบรับได้ (จำกัดไม่เกิน 15MB)',
        suggestion: 'กรุณาลดขนาดภาพหรือเลือกไฟล์รูปภาพอื่น',
        statusCode: 413,
        rawMessage: rawMsg,
        canRetry: false,
      };
    }

    // 429: Rate Limit / AI Quota Exceeded
    if (status === 429) {
      return {
        title: 'คำขอใช้งานเกินขีดจำกัดชั่วคราว (429 Too Many Requests)',
        message: 'มีการเรียกใช้งานระบบหรือประมวลผล AI ถี่เกินกำหนด โควต้าชั่วคราวเต็ม',
        suggestion: 'กรุณารอสักครู่ (ประมาณ 30-60 วินาที) แล้วลองใหม่อีกครั้ง',
        statusCode: 429,
        rawMessage: rawMsg,
        canRetry: true,
      };
    }

    // 500, 502, 503, 504: Server Error
    if (status >= 500) {
      return {
        title: 'เซิร์ฟเวอร์ขัดข้องชั่วคราว (Server Error)',
        message: 'เกิดข้อผิดพลาดในการประมวลผลที่ระบบเซิร์ฟเวอร์',
        suggestion: 'ระบบกำลังดำเนินการแก้ไข กรุณารอสักครู่แล้วกดปุ่มลองใหม่อีกครั้ง',
        statusCode: status,
        rawMessage: rawMsg,
        canRetry: true,
      };
    }

    // Other status
    return {
      title: `เกิดข้อผิดพลาด (รหัส ${status})`,
      message: typeof rawMsg === 'string' && !rawMsg.includes('Http failure') ? rawMsg : 'ระบบไม่สามารถดำเนินการได้ในขณะนี้',
      suggestion: 'กรุณาลองใหม่อีกครั้งในภายหลัง',
      statusCode: status,
      rawMessage: rawMsg,
      canRetry: true,
    };
  }

  private mapBadRequestMessage(raw: string, context: ErrorContext): string {
    if (raw && typeof raw === 'string') {
      if (raw.includes('Validation failed')) return 'ข้อมูลที่กรอกไม่ผ่านการตรวจสอบ กรุณาตรวจสอบความถูกต้อง';
      if (raw.includes('amount') || raw.includes('ยอดเงิน')) return 'กรุณาระบุจำนวนเงินให้ถูกต้อง (ต้องเป็นตัวเลขมากกว่า 0)';
      if (raw.includes('name') || raw.includes('ชื่อ')) return 'กรุณาระบุชื่อรายการหรือชื่อหมวดหมู่';
      if (raw.includes('date') || raw.includes('วันที่')) return 'รูปแบบวันที่ไม่ถูกต้อง กรุณาเลือกวันที่ใหม่';
    }

    switch (context) {
      case 'receipt':
        return 'ไม่สามารถอ่านข้อมูลจากภาพใบเสร็จนี้ได้ รูปภาพอาจไม่ชัดเจนหรือไม่มีข้อมูลราคา';
      case 'chat':
        return 'รูปแบบข้อความไม่ถูกต้อง กรุณาระบุชื่อรายการและจำนวนเงิน เช่น "ข้าวผัด 50"';
      case 'categories':
        return 'ข้อมูลหมวดหมู่ไม่ถูกต้อง กรุณาระบุชื่อและเลือกไอคอน';
      case 'budgets':
        return 'ข้อมูลงบประมาณไม่ถูกต้อง กรุณาระบุจำนวนเงินงบประมาณ';
      default:
        return 'ข้อมูลที่ส่งไปประมวลผลไม่สมบูรณ์หรือไม่ถูกต้อง';
    }
  }

  private mapNotFoundMessage(context: ErrorContext): string {
    switch (context) {
      case 'transactions':
        return 'ไม่พบรายการธุรกรรมตามเงื่อนไขที่ค้นหา หรือระบบบันทึกรายการยังไม่พร้อมใช้งาน';
      case 'categories':
        return 'ไม่พบข้อมูลหมวดหมู่ที่ระบุ หมวดหมู่นี้อาจถูกลบไปแล้ว';
      case 'budgets':
        return 'ไม่พบข้อมูลงบประมาณสำหรับหมวดหมู่ที่ระบุ';
      case 'expenses':
      case 'income':
        return 'ไม่พบรายการที่ต้องการแก้ไขหรือลบ';
      default:
        return 'ไม่พบบริการหรือข้อมูลที่ระบุในระบบ';
    }
  }

  private mapConflictMessage(raw: string, context: ErrorContext): string {
    if (context === 'categories') {
      return 'ชื่อหมวดหมู่นี้มีอยู่ในระบบแล้ว กรุณาตั้งชื่ออื่นที่ไม่ซ้ำกัน';
    }
    if (context === 'budgets') {
      return 'มีการตั้งงบประมาณสำหรับหมวดหมู่นี้ไว้แล้ว กรุณาเลือกแก้ไขงบประมาณเดิมแทน';
    }
    if (context === 'auth') {
      return 'ชื่อผู้ใช้ (Username) นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น';
    }
    return raw || 'ข้อมูลนี้มีอยู่ในระบบแล้ว ไม่สามารถสร้างซ้ำได้';
  }

  private fromVoiceError(err: any): AppErrorInfo {
    const errorType = err?.error || err?.message;
    switch (errorType) {
      case 'not-allowed':
      case 'permission-denied':
        return {
          title: 'ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน',
          message: 'เบราว์เซอร์ไม่ได้รับสิทธิ์เข้าถึงไมโครโฟน',
          suggestion: 'กรุณากดไอคอนรูปแม่กุญแจหรือตั้งค่าที่แถบ URL ของเบราว์เซอร์ แล้วเลือก "อนุญาตไมโครโฟน"',
          canRetry: false,
        };
      case 'no-speech':
        return {
          title: 'ไม่พบเสียงพูด',
          message: 'ระบบไม่ได้ยินเสียงพูด หรือพูดเบาเกินไป',
          suggestion: 'กรุณากดปุ่มไมค์อีกครั้ง แล้วพูดใกล้ๆ ไมโครโฟน เช่น "ข้าวผัด 60 กาแฟ 40"',
          canRetry: true,
        };
      case 'network':
        return {
          title: 'ระบบรู้จำเสียงขัดข้อง',
          message: 'ไม่สามารถติดต่อบริการแปลงเสียงเป็นข้อความได้ (Network issue)',
          suggestion: 'ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต หรือพิมพ์ด้วยแป้นพิมพ์แทน',
          canRetry: true,
        };
      default:
        return {
          title: 'การบันทึกด้วยเสียงขัดข้อง',
          message: 'ไม่สามารถประมวลผลเสียงพูดได้ในขณะนี้',
          suggestion: 'กรุณาลองพูดใหม่อีกครั้ง หรือพิมพ์ข้อความแทน',
          canRetry: true,
        };
    }
  }

  private fromCustomString(msg: string, context: ErrorContext): AppErrorInfo {
    return {
      title: 'ข้อผิดพลาดในการทำงาน',
      message: msg,
      suggestion: 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
      rawMessage: msg,
      canRetry: true,
    };
  }
}
