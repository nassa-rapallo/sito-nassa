export type BooleanReturn = () => boolean

type ReturnType = {
	isMobile: BooleanReturn
	isDesktop: BooleanReturn
	isAndroid: BooleanReturn
	isIos: BooleanReturn
	isSSR: BooleanReturn
}

const getMobileDetect = (userAgent: string): ReturnType => {
	const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i))
	const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
	const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i))
	const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i))
	const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i))

	const isMobile = (): boolean =>
		Boolean(isAndroid() || isIos() || isOpera() || isWindows())
	const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR())
	return {
		isMobile,
		isDesktop,
		isAndroid,
		isIos,
		isSSR
	}
}

export const useMobile = (): ReturnType => {
	const userAgent =
		typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
	return getMobileDetect(userAgent)
}
