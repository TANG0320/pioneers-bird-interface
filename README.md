# Video Page Replica

This workspace recreates the interface shown in:

`E:/xwechat_files/wxid_u49tpvmvdkvj22_b5b1/msg/video/2026-06/cc93551d74083876741b37a5352bbf14.mp4`

## Preview

Run:

```powershell
node server.mjs
```

Then open:

`http://localhost:5173/`

## Main Deliverables

- `index.html` - the recreated interactive browser page.
- `specimen.png` - the central bird/specimen image cropped from the video.
- `page_920.png` - verified 920 x 518 render of the recreated page.
- `page_390_final.png` - verified mobile/tall-window render matching the video's presentation.
- `figma_import.svg` - import-ready SVG embedding the final 920 x 518 render for Figma.
- `figma_layered.svg` - editable SVG approximation with separate interface shapes, text, meters, controls, and embedded specimen art.

## Interactions

- Click the left unit cards or the previous/next controls to switch units.
- Click `CONFIRM` to sync the selected unit and update the footer status.
- Click `LOCK` to toggle a locked visual state.
- Click `II` / `PLAY` to pause and resume the bird/platform/meter animations.
- Click `MSG` to open the unit signal panel.
- Click `LINK` to copy the current unit code.
- The center bird is a local Three.js 3D model, not a flat image.
- Drag the bird to rotate the model in 3D.
- Hover or click the bird to trigger idle, inspection, hop, head-look, and wing-flap reactions.
- Switching units recolors the 3D bird and updates stats/abilities.

## Notes

The Figma MCP write tools were not exposed in this session, so the page could not be pushed directly into a Figma canvas. `figma_layered.svg` can be dragged into Figma for an editable starting point, and `figma_import.svg` can be used as a pixel-reference layer.
