import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { key, contentType, action } = await req.json();
  const bucket = Deno.env.get("R2_BUCKET_NAME");
  const accountId = Deno.env.get("R2_ACCOUNT_ID");
  const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");

  if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
    return Response.json(
      { error: "R2 is not configured" },
      { status: 500, headers: corsHeaders },
    );
  }

  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  if (action === "upload") {
    const url = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 },
    );

    return Response.json({ url, key }, { headers: corsHeaders });
  }

  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 },
  );
  return Response.json({ url }, { headers: corsHeaders });
});
