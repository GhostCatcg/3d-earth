// Definitions to let TS understand .vs, .fs, .glsl shader files
/**
 * 声明着色器
 */

declare module '*.fs' {
	const value: string
	export default value
}
declare module '*.vs' {
	const value: string
	export default value
}
declare module '*.glsl' {
	const value: string
	export default value
}