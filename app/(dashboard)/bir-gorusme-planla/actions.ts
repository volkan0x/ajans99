'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type FormState = {
  success: boolean;
  message?: string;
  error?: string;
} | null;

export async function submitMeetingRequest(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const company = formData.get('company') as string;
  const message = formData.get('message') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;

  // Validasyon
  if (!name || !email || !phone) {
    return {
      success: false,
      error: 'Lütfen tüm zorunlu alanları doldurun.'
    };
  }

  try {
    // E-posta gönder
    const { data, error } = await resend.emails.send({
      from: 'Feedbird <onboarding@resend.dev>', // Resend test adresi
      to: ['nifyloses@gmail.com'], // Resend test modunda sadece kayıtlı e-postanıza gönderilebilir
      replyTo: email, // Müşteri e-postasına cevap verebilmek için
      subject: `Yeni Görüşme Talebi - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Yeni Görüşme Talebi</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ad Soyad:</strong> ${name}</p>
            <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>
            ${company ? `<p><strong>Şirket:</strong> ${company}</p>` : ''}
            ${message ? `<p><strong>Mesaj:</strong><br/>${message}</p>` : ''}
            <p><strong>Tercih Edilen Tarih:</strong> ${date}</p>
            <p><strong>Tercih Edilen Saat:</strong> ${time}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px;">Bu e-posta görüşme planlama formundan otomatik olarak gönderilmiştir.</p>
        </div>
      `
    });

    if (error) {
      console.error('E-posta gönderme hatası:', error);
      return {
        success: false,
        error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.'
      };
    }

    return {
      success: true,
      message: 'Görüşme talebiniz başarıyla gönderildi!'
    };
  } catch (error) {
    console.error('Hata:', error);
    return {
      success: false,
      error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    };
  }
}
