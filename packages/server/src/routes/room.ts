import { Router } from 'express';
import User from '../schemas/user';
import Room from '../schemas/room';


const router = Router();

//채팅 목록
router.get('/', async (req,res) => {
    try {
        const room = await Room.findAll({
            include: User
        });
        res.json(room);
    } catch(e){}
})
//채팅방 상세
router.get('/:roomId',async (req,res) => {
    try{
        const room = await Room.findOne({
            where: {
                id: Number(req.params.roomId),
            },
            include: User
        })
        res.json(room);
    } catch(e) { }
})
//채팅방 생성
router.post('/', async(req,res) => {
    try {
        const room = await Room.create({
            opponentID: req.body.opponentID,
        })
        res.json(room);
    } catch(e){ }
});

export default Router