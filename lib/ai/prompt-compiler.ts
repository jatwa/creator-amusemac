import { DirectorShotConfig } from "@/data/types";
import { TargetEngine } from "./engine-configs";

/**
 * Output A: Human-Readable Director Recipe Slip
 */
export function compileDirectorRecipe(shotConfig: Partial<DirectorShotConfig>): string {
  const lines = [
    `=== CREATOR INTEL DIRECTOR SLIP ===`,
    `SHOT: ${shotConfig.shotTitle || "Untitled Cinematic Shot"}`,
    `CATEGORY: ${shotConfig.shotCategory || "DIRECTOR RECIPE"}`,
    `SUBJECT: ${shotConfig.subject || "Subject"}`,
    `ACTION: ${shotConfig.action || "Action"}`,
    `CAMERA: ${shotConfig.cameraRig || "Rig"} — ${shotConfig.cameraMovement || "Movement"}`,
    `LENS: ${shotConfig.lens || "Lens"}`,
    `FRAMING: ${shotConfig.framing || "Framing"} (${shotConfig.composition || "Composition"})`,
    `LIGHTING: ${shotConfig.lighting || "Lighting"}`,
    `ENVIRONMENT: ${shotConfig.environment || "Environment"} (${shotConfig.timeOfDay || "Time"}, ${shotConfig.weather || "Weather"})`,
    `FORMAT: ${shotConfig.aspectRatio || "2.39:1"} | ${shotConfig.fps || "24fps"} | ${shotConfig.duration || "5s"}`,
    `VISUAL INTENT: ${shotConfig.visualStyle || "Cinematic"} — ${shotConfig.mood || "Atmospheric"}`,
    `===================================`,
  ];
  return lines.join("\n");
}

/**
 * Output B: Model-Specific Syntactic Prompt Compiler
 */
export function compileModelPrompt(
  shotConfig: Partial<DirectorShotConfig>,
  selectedEngine: TargetEngine
): string {
  const s = shotConfig.subject || "subject";
  const a = shotConfig.action || "in motion";
  const env = shotConfig.environment || "environment";
  const w = shotConfig.weather || "clear atmosphere";
  const t = shotConfig.timeOfDay || "night";
  const rig = shotConfig.cameraRig || "camera rig";
  const move = shotConfig.cameraMovement || "tracking shot";
  const lens = shotConfig.lens || "35mm prime";
  const frame = shotConfig.framing || "cinematic shot";
  const comp = shotConfig.composition || "rule of thirds";
  const light = shotConfig.lighting || "motivated lighting";
  const style = shotConfig.visualStyle || "cinematic feature";
  const fps = (shotConfig.fps || "24fps").split(" ")[0];
  const arRaw = (shotConfig.aspectRatio || "2.39:1").split(" ")[0];

  switch (selectedEngine) {
    case "runway":
      return `[Camera: ${rig} - ${move} at ${fps}] ${frame} of ${s} ${a} through ${env} at ${t} during ${w}, ${comp}, dynamic reflections across surfaces, controlled ${light}, shot on ${lens}, ${style} cinematography, ${arRaw}, ${fps}.`;
    case "kling":
      return `${frame} of ${s} ${a} through ${env} at ${t} during ${w}, ${rig} ${move}, natural physical momentum and realistic atmospheric physics, controlled ${light}, ${lens} optics, ${comp}, ${shotConfig.duration || "10s"} continuous take, ${fps}.`;
    case "veo":
      return `Cinematic 4K shot: ${frame} of ${s} ${a} through ${env}, ${rig} ${move}, ${lens} optics with natural atmospheric falloff, ${light}, ${comp}, photorealistic color science, ${arRaw}, ${fps}.`;
    case "luma":
      return `Dynamic 3D ${rig} ${move} shot of ${s} ${a} in ${env} during ${w}, high-speed spatial parallax, ${light}, ${lens} optical rendering, ${style} cadence.`;
    case "minimax":
      return `Intimate ${frame} of ${s} ${a} in ${env}, natural textures and organic atmospheric interactions, ${move}, ${light}, ${lens}, ${fps}.`;
    case "midjourney":
      return `A cinematic 35mm film still of ${s} ${a} in ${env} at ${t} during ${w}, ${frame}, ${rig} perspective, ${comp}, ${light}, shot on ${lens}, Kodak film stock emulsion, ${style} --ar ${arRaw} --style raw --v 6.1`;
    case "flux":
      return `A photorealistic editorial photograph: ${frame} of ${s} ${a} in ${env} at ${t}, ${comp}, ${light}, shot on ${lens}, razor sharp focus, ${style}.`;
    case "wan":
      return `Master video plate: ${frame} of ${s} ${a} in ${env}, ComfyUI Wan 2.1 14B diffusion pass, ${rig} ${move}, ${light}, ${lens}, cinematic LoRA weights (0.85).`;
    default:
      return `${frame} of ${s} ${a} in ${env}, ${rig}, ${lens}, ${light}, ${fps}.`;
  }
}

/**
 * Output C: Engine-Calibrated Negative Prompt Compiler
 */
export function compileNegativePrompt(selectedEngine: TargetEngine): string {
  switch (selectedEngine) {
    case "midjourney":
      return `--no plastic, oversaturated, deformed, blurry, extra limbs, watermark, text, signature`;
    case "runway":
      return `Distorted geometry, warped chassis, unnatural motion acceleration, morphing objects, erratic camera jitter, low resolution, blown-out highlights`;
    case "kling":
      return `Unnatural physics, sudden morphing, jittery frame interpolation, bad anatomy, deformed wheels, floating artifacts, compression noise`;
    case "veo":
      return `Overexposed, muddy shadows, low dynamic range, cartoonish render, unnatural face geometry, plastic textures, artificial sheen`;
    case "luma":
      return `3D model artifacting, spatial warping, blurry background smearing, sudden jump cuts, deformed meshes, ghosting vectors`;
    case "minimax":
      return `Wax skin, artificial eye reflections, unnatural head movements, robotic gestures, flickering shadows, deformed fingers`;
    case "flux":
      return `Blurry, cartoon, CGI render, 3d illustration, low quality, oversaturated, missing details, malformed proportions`;
    case "wan":
      return `Deformed hands, bad anatomy, frame ghosting, flickering lighting, noisy artifacts, unnatural jump cuts`;
    default:
      return `Blurry, low resolution, deformed, morphing, unnatural artifacts`;
  }
}
