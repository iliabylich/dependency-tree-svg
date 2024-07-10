use crate::Input;

const JS: &str = include_str!("../assets/output.js");
const SVG: &str = include_str!("../assets/main.svg");

pub fn compile_svg(input: Input, box_size: usize) -> String {
    let js_script = format!(
        "
<script>
<![CDATA[
window.data = {};
{JS};
]]>
</script>",
        serde_json::to_string_pretty(&input).unwrap()
    );

    SVG.replace("width: 100px;", &format!("width: {box_size}px;"))
        .replace("height: 100px;", &format!("height: {box_size}px;"))
        .replace("<script href=\"./output.js\"></script>", &js_script)
}
