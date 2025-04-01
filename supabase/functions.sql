
-- Function to get a bookmark by user and post IDs
CREATE OR REPLACE FUNCTION public.get_bookmark_by_post_and_user(p_user_id UUID, p_post_id UUID)
RETURNS SETOF public.bookmarks
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM public.bookmarks 
  WHERE user_id = p_user_id AND post_id = p_post_id;
$$;

-- Function to delete a bookmark
CREATE OR REPLACE FUNCTION public.delete_bookmark(p_user_id UUID, p_post_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  DELETE FROM public.bookmarks 
  WHERE user_id = p_user_id AND post_id = p_post_id;
$$;

-- Function to insert a bookmark
CREATE OR REPLACE FUNCTION public.insert_bookmark(p_user_id UUID, p_post_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.bookmarks (user_id, post_id)
  VALUES (p_user_id, p_post_id);
$$;

-- Function to get user posts with all details
CREATE OR REPLACE FUNCTION public.get_user_posts_with_details(p_user_id UUID)
RETURNS SETOF json
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    json_build_object(
      'id', p.id,
      'user_id', p.user_id,
      'content', p.content,
      'image_url', p.image_url,
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'user', up,
      'comments', COALESCE(comments, '[]'::json),
      'reactions', COALESCE(reactions, '[]'::json),
      'reaction_counts', json_build_object(
        'like', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'like'), 0),
        'heart', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'heart'), 0),
        'thumbs_up', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'thumbs_up'), 0),
        'thumbs_down', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'thumbs_down'), 0)
      )
    )
  FROM 
    posts p
  LEFT JOIN
    user_profiles up ON p.user_id = up.id
  LEFT JOIN LATERAL (
    SELECT json_agg(
      json_build_object(
        'id', c.id,
        'post_id', c.post_id,
        'user_id', c.user_id,
        'content', c.content,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'user', cup
      )
    ) AS comments
    FROM 
      comments c
    LEFT JOIN
      user_profiles cup ON c.user_id = cup.id
    WHERE 
      c.post_id = p.id
  ) comments ON true
  LEFT JOIN LATERAL (
    SELECT json_agg(r) AS reactions
    FROM reactions r
    WHERE r.post_id = p.id
  ) reactions ON true
  WHERE p.user_id = p_user_id
  ORDER BY p.created_at DESC;
$$;

-- Function to get user's bookmarks with post details
CREATE OR REPLACE FUNCTION public.get_user_bookmarks_with_posts(p_user_id UUID)
RETURNS SETOF json
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    json_build_object(
      'id', b.id,
      'user_id', b.user_id,
      'post_id', b.post_id,
      'created_at', b.created_at,
      'post', json_build_object(
        'id', p.id,
        'user_id', p.user_id,
        'content', p.content,
        'image_url', p.image_url,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'user', up,
        'comments', COALESCE(comments, '[]'::json),
        'reactions', COALESCE(reactions, '[]'::json),
        'reaction_counts', json_build_object(
          'like', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'like'), 0),
          'heart', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'heart'), 0),
          'thumbs_up', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'thumbs_up'), 0),
          'thumbs_down', COALESCE((SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.type = 'thumbs_down'), 0)
        )
      )
    )
  FROM
    bookmarks b
  JOIN
    posts p ON b.post_id = p.id
  LEFT JOIN
    user_profiles up ON p.user_id = up.id
  LEFT JOIN LATERAL (
    SELECT json_agg(
      json_build_object(
        'id', c.id,
        'post_id', c.post_id,
        'user_id', c.user_id,
        'content', c.content,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'user', cup
      )
    ) AS comments
    FROM
      comments c
    LEFT JOIN
      user_profiles cup ON c.user_id = cup.id
    WHERE
      c.post_id = p.id
  ) comments ON true
  LEFT JOIN LATERAL (
    SELECT json_agg(r) AS reactions
    FROM reactions r
    WHERE r.post_id = p.id
  ) reactions ON true
  WHERE b.user_id = p_user_id
  ORDER BY b.created_at DESC;
$$;

-- Function to get pending friend requests for a user
CREATE OR REPLACE FUNCTION public.get_pending_friend_requests(p_user_id UUID)
RETURNS SETOF json
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    json_build_object(
      'id', f.id,
      'requestor_id', f.requestor_id,
      'recipient_id', f.recipient_id,
      'status', f.status,
      'created_at', f.created_at,
      'updated_at', f.updated_at,
      'requestor', up
    )
  FROM
    friendships f
  JOIN
    user_profiles up ON f.requestor_id = up.id
  WHERE
    f.recipient_id = p_user_id AND f.status = 'pending'
  ORDER BY f.created_at DESC;
$$;

-- Function to get friendship status between two users
CREATE OR REPLACE FUNCTION public.get_friendship_status(p_user_id UUID, p_other_user_id UUID)
RETURNS SETOF json
LANGUAGE SQL
SECURITY DEFINER
AS $$
  WITH friendship_data AS (
    -- Check if current user sent a request to the other user
    SELECT
      id,
      'pending' AS status
    FROM
      friendships
    WHERE
      requestor_id = p_user_id AND recipient_id = p_other_user_id AND status = 'pending'
    
    UNION ALL
    
    -- Check if current user has an accepted friendship with the other user (either direction)
    SELECT
      id,
      'accepted' AS status
    FROM
      friendships
    WHERE
      ((requestor_id = p_user_id AND recipient_id = p_other_user_id) OR
       (requestor_id = p_other_user_id AND recipient_id = p_user_id)) AND
      status = 'accepted'
    
    UNION ALL
    
    -- Check if other user sent a request to the current user
    SELECT
      id,
      'requested' AS status
    FROM
      friendships
    WHERE
      requestor_id = p_other_user_id AND recipient_id = p_user_id AND status = 'pending'
    
    UNION ALL
    
    -- If no rows above, return 'none'
    SELECT
      NULL AS id,
      'none' AS status
    WHERE
      NOT EXISTS (
        SELECT 1 FROM friendships 
        WHERE 
          ((requestor_id = p_user_id AND recipient_id = p_other_user_id) OR
           (requestor_id = p_other_user_id AND recipient_id = p_user_id))
      )
  )
  SELECT json_build_object('status', status)
  FROM friendship_data
  LIMIT 1;
$$;

-- Function to get a user's friends
CREATE OR REPLACE FUNCTION public.get_user_friends(p_user_id UUID)
RETURNS SETOF json
LANGUAGE SQL
SECURITY DEFINER
AS $$
  -- Get friendships where user is requestor
  SELECT
    json_build_object(
      'id', f.id,
      'requestor_id', f.requestor_id,
      'recipient_id', f.recipient_id,
      'status', f.status,
      'created_at', f.created_at,
      'updated_at', f.updated_at,
      'recipient', up
    )
  FROM
    friendships f
  JOIN
    user_profiles up ON f.recipient_id = up.id
  WHERE
    f.requestor_id = p_user_id AND f.status = 'accepted'
  
  UNION ALL
  
  -- Get friendships where user is recipient
  SELECT
    json_build_object(
      'id', f.id,
      'requestor_id', f.requestor_id,
      'recipient_id', f.recipient_id,
      'status', f.status,
      'created_at', f.created_at,
      'updated_at', f.updated_at,
      'requestor', up
    )
  FROM
    friendships f
  JOIN
    user_profiles up ON f.requestor_id = up.id
  WHERE
    f.recipient_id = p_user_id AND f.status = 'accepted'
  
  ORDER BY 
    created_at DESC;
$$;
