import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    console.log('📨 Meeting form submission received');
    
    const body = await request.json();
    console.log('📋 Form data:', body);
    
    const { name, email, phone, company, message, date, time } = body;

    // Validasyon
    if (!name || !email || !phone || !date || !time) {
      console.log('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { success: false, error: 'Lütfen tüm zorunlu alanları doldurun.' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Geliştirme modunda API key yoksa sadece console'a yaz
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
      console.log('📧 E-posta gönderme simülasyonu (Resend API key bulunamadı):');
      console.log('👤 Ad Soyad:', name);
      console.log('📧 E-posta:', email);
      console.log('📱 Telefon:', phone);
      if (company) console.log('🏢 Şirket:', company);
      if (message) console.log('💬 Mesaj:', message);
      console.log('📅 Tarih:', date);
      console.log('🕐 Saat:', time);
      console.log('\n✅ Form verisi başarıyla alındı (e-posta gönderilmedi - API key eksik)\n');

      return NextResponse.json({
        success: true,
        message: 'Test modu: Form verisi alındı! (E-posta gönderilemedi - Resend API key eksik)'
      });
    }

    // E-posta gönder
    if (!resend) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Ajans 99 <onboarding@resend.dev>',
      to: ['nifyloses@gmail.com'], // ZORUNLU: Resend test modunda sadece kayıtlı e-postanıza gönderilebilir
      replyTo: email,
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
      return NextResponse.json(
        { success: false, error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      );
    }

    console.log('✅ E-posta başarıyla gönderildi:', data);

    return NextResponse.json({
      success: true,
      message: 'Görüşme talebiniz başarıyla gönderildi!'
    });
  } catch (error) {
    console.error('❌ API Hatası:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
