import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import unidecode from "unidecode";

// [GET] /search/:type
export const result = async (req: Request, res: Response) => {
  const type: string = `${req.params.type}`

  const keyword: string = `${req.query.keyword}`;

  // Loại bỏ dấu
  const unidecodeText: string = unidecode(keyword);

  // Loại bỏ khoảng trắng giữa các từ
  const keywordSlug = unidecodeText.replace(/\s+/g, "-");

  // Tạo Regex cho keywordSlug
  const keywordSlugRegex = new RegExp(keywordSlug, "i");

  const keywordRegex = new RegExp(keyword, "i");

  let songsDetail = [];
  if (keyword) {
    const songs = await Song.find({
      $or: [{ slug: keywordSlugRegex }, { title: keywordRegex }],
      deleted: false,
      status: "active",
    }).select("avatar title singerId like slug");

    for (const item of songs) {
      const singer = await Singer.findOne({
        _id: item.singerId,
        deleted: false,
      }).select("fullName");

      songsDetail.push({
        id: item.id,
        avatar: item.avatar,
        title: item.title,
        like: item.like,
        slug: item.slug,
        singer: {
          fullName: singer.fullName
        },
      });
    }
  }

  if(type == "result") {
    res.render("client/pages/search/result", {
      pageTitle: `Kết quả: ${keyword}`,
      keyword: keyword,
      songs: songsDetail
    });
  } else {
    res.json({
      code: 200,
      songs: songsDetail
    });
  }
};
