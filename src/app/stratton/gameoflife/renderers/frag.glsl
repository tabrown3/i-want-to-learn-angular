varying highp vec3 vLighting;

void main(void) {
    gl_FragColor = vec4(vLighting, 1.0);
}