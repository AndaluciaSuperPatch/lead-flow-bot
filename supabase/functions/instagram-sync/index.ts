
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const INSTAGRAM_ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
    
    if (!INSTAGRAM_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Instagram Access Token no configurado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obtener datos reales de Instagram
    const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`)
    
    if (!response.ok) {
      throw new Error('Error obteniendo datos de Instagram')
    }

    const data = await response.json()
    
    // Procesar los datos para extraer leads reales
    const realLeads = []
    
    if (data.data) {
      for (const post of data.data) {
        // Obtener comentarios del post
        const commentsResponse = await fetch(`https://graph.instagram.com/${post.id}/comments?fields=id,text,username,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`)
        
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json()
          
          if (commentsData.data) {
            for (const comment of commentsData.data) {
              // Analizar si el comentario indica interés comercial
              const isBusinessLead = /(?:precio|comprar|interesa|contacto|info|información|negocio|empresa)/i.test(comment.text)
              
              if (isBusinessLead) {
                realLeads.push({
                  platform: 'instagram',
                  post_id: post.id,
                  username: comment.username,
                  comment: comment.text,
                  timestamp: comment.timestamp,
                  type: 'comment_lead',
                  source: 'instagram_real_api'
                })
              }
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leads: realLeads,
        posts_analyzed: data.data?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
