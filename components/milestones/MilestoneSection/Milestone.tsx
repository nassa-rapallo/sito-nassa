import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { up } from 'styled-breakpoints'
import styled from 'styled-components'

import {
	MilestoneBig,
	MilestoneDescription,
	MilestoneSmall,
	MilestoneTitle,
	MilestoneDate,
	MobileDate
} from './Types'

import { IMilestonesFields } from 'app/shared/contentful'
import { Position } from 'app/shared/types'
import { capitalize } from 'app/utils/capitalize'
import { getPosition } from 'app/utils/getPosition'

export type Props = {
	milestone: Omit<IMilestonesFields, 'nassa'>
	positionInList: number
}

export const Milestone = ({
	milestone,
	positionInList
}: Props): JSX.Element => {
	const [boxHeight, setBoxHeight] = useState<number>(0)
	const [boxWidth, setBoxWidth] = useState<number>(0)
	const [position, setPosition] = useState<Position>('left')
	const milestoneBoxRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (milestoneBoxRef.current) {
			setBoxHeight(milestoneBoxRef.current.clientHeight)
			setBoxWidth(milestoneBoxRef.current.clientWidth + 50)
		}
	}, [milestoneBoxRef.current])

	useEffect(() => {
		setPosition(getPosition(positionInList))
	}, [positionInList])

	const formatDate = (date: string | undefined) => {
		return capitalize(dayjs(date).locale('it').format('MMMM YYYY'))
	}

	return (
		<Base
			initial={{ opacity: 0, translateX: positionInList % 2 === 0 ? -50 : 50 }}
			animate={{ opacity: 1, translateX: 0 }}
			transition={{ duration: 0.5, delay: positionInList * 0.5 }}
			position={position}
		>
			<MilestoneBall
				whileHover={{
					border: '8px solid #0075BF',
					transition: { duration: 0.5 }
				}}
			/>

			{milestone.date && (
				<MilestoneDate position={position}>
					{formatDate(milestone.date)}
				</MilestoneDate>
			)}

			<Box position={position} height={boxHeight} width={boxWidth}>
				{!milestone.description && (
					<MilestoneSmall
						ref={milestoneBoxRef}
						position={position}
						height={boxHeight}
						key={milestone.date}
					>
						<MobileDate small>{formatDate(milestone.date)}</MobileDate>
						<MilestoneTitle position={position} small>
							{milestone.title}
						</MilestoneTitle>
					</MilestoneSmall>
				)}

				{milestone.description && (
					<MilestoneBig
						ref={milestoneBoxRef}
						position={position}
						height={boxHeight}
						key={milestone.date}
					>
						<MobileDate>{formatDate(milestone.date)}</MobileDate>
						<MilestoneTitle position={position}>
							{milestone.title}
						</MilestoneTitle>
						<MilestoneDescription>{milestone.description}</MilestoneDescription>
					</MilestoneBig>
				)}
			</Box>
		</Base>
	)
}

const Base = styled(motion.div)<{ position: Position }>`
	position: relative;
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const MilestoneBall = styled(motion.span)`
	width: 30px;
	height: 30px;
	background-color: ${({ theme }) => theme.palette.whiteNassa};
	border-radius: 100%;
	border: 4px solid ${({ theme }) => theme.palette.blueNassa};

	z-index: 3;
	cursor: pointer;

	left: 50%;
	top: 40px;
	transform: translate(-50%, -50%);

	position: absolute;
	${up('lg')} {
		top: 50%;
	}
`

const Box = styled.div<{ position: Position; height: number; width: number }>`
	margin-top: 40px;
	${up('lg')} {
		padding: ${(props) =>
			props.position === 'left'
				? props.theme.spacing(1, 1, 1, 3)
				: props.theme.spacing(1, 3, 1, 1)};
		margin-left: ${(props) =>
			props.position === 'left' ? props.width + 'px' : 'inherit'};
		margin-right: ${(props) =>
			props.position === 'right' ? props.width + 'px' : 'inherit'};
		margin-top: inherit;
	}
`
