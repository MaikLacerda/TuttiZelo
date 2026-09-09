export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const event = req.body;

  // Trata eventos do Asaas (ex: PAYMENT_RECEIVED ou PAYMENT_CONFIRMED)
  if (event && (event.event === 'PAYMENT_RECEIVED' || event.event === 'PAYMENT_CONFIRMED')) {
    const payment = event.payment;
    const hiringId = payment.externalReference;

    console.log(`[TUTTIZELO WEBHOOK] Pagamento confirmado para o plantão: ${hiringId}`);

    // Aqui o webhook conecta ao Supabase via Service Key para dar baixa automática
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && hiringId) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/hirings?id=eq.${hiringId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            status: 'escrow_hold',
            payment_id: payment.id,
            paid_at: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Erro ao atualizar Supabase via Webhook:', err);
      }
    }
  }

  return res.status(200).json({ received: true });
}
