
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
    const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN')
    
    if (!FACEBOOK_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Facebook Access Token no configurado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obtener datos reales de Facebook Pages
    const response = await fetch(`https://graph.facebook.com/me/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true)&access_token=${FACEBOOK_ACCESS_TOKEN}`)
    
    if (!response.ok) {
      throw new Error('Error obteniendo datos de Facebook')
    }

    const data = await response.json()
    const realLeads = []
    
    if (data.data) {
      for (const post of data.data) {
        // Obtener comentarios detallados
        const commentsResponse = await fetch(`https://graph.facebook.com/${post.id}/comments?fields=id,message,from,created_time&access_token=${FACEBOOK_ACCESS_TOKEN}`)
        
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json()
          
          if (commentsData.data) {
            for (const comment of commentsData.data) {
              const isBusinessLead = /(?:precio|comprar|interesa|contacto|info|información|negocio|empresa|WhatsApp|teléfono)/i.test(comment.message)
              
              if (isBusinessLead) {
                realLeads.push({
                  platform: 'facebook',
                  post_id: post.id,
                  user_id: comment.from.id,
                  username: comment.from.name,
                  comment: comment.message,
                  timestamp: comment.created_time,
                  type: 'comment_lead',
                  source: 'facebook_real_api'
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
