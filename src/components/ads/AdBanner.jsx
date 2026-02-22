export default function AdBanner() {
  const html = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;overflow:hidden;}</style></head>
<body>
<script>
  atOptions = { 'key' : '87afe0cbb8dd8164f2c3a4a2524323d6', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
<\/script>
<script src="https://www.highperformanceformat.com/87afe0cbb8dd8164f2c3a4a2524323d6/invoke.js"><\/script>
</body>
</html>`;

  return (
    <div className="flex justify-center my-6">
      <iframe
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin allow-popups-to-escape-sandbox"
        style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}