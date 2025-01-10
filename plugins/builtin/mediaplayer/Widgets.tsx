import { Gtk } from "astal/gtk3";
import Mpris from "gi://AstalMpris";
import { bind, Variable } from "astal";
import { togglePopup } from "core/Popup";
import { Astal } from "astal/gtk3";
import { Gdk } from "astal/gtk3";

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

export function MediaPlayerWidget({ player }: { player: Mpris.Player }) {
  const title = bind(player, "title").as((t) => t || "Unknown Track");

  const artist = bind(player, "artist").as((a) => a || "Unknown Artist");
  const cover = bind(player, "artUrl").as((a) => a || "Unknown CoverArt");
  const remainingPositon = Variable(player.length - player.position);
  bind(player, "position").subscribe((position) => {
    if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) {
      remainingPositon.set(player.length - position);
    }
  });

  return (
    <box className="mediaPlayer">
      <box
        className="icon"
        css={`
          background-image: url("${cover.get()}");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 0.5rem;
          min-width: 1rem;
          min-height: 1rem;
          margin-top: 0.3rem;
          margin-bottom: 0.3rem;
        `}
      />
      <label className="title" truncate={true} label={title} />
      <label label=" - " />
      <label className="artist" truncate={true} label={artist} />
      <label
        className="position"
        label={remainingPositon().as((rp) => ` (${lengthStr(rp)})`)}
      />
    </box>
  );
}

function MediaPlayer({ player }: { player: Mpris.Player }) {
  const { START, END, CENTER } = Gtk.Align;

  const title = bind(player, "title").as((t) => t || "Unknown Track");

  const artist = bind(player, "artist").as((a) => a || "Unknown Artist");
  const cover = bind(player, "artUrl").as((a) => a || "Unknown CoverArt");
  const album = bind(player, "album").as((a) => a || "Unknown Album");

  // player.position will keep changing even when the player is paused.  This is a workaround
  const realPosition = Variable(player.position);
  bind(player, "position").subscribe((position) => {
    if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) {
      realPosition.set(position);
    }
  });

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === Mpris.PlaybackStatus.PLAYING ? "" : "",
  );

  return (
    <box className="mediaPlayerPopup" vertical={true}>
      <box className="info">
        <box
          className="cover"
          css={`
            background-image: url("${cover.get()}");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
          `}
        />

        <box vertical={true}>
          <label
            truncate={true}
            className="large title"
            halign={START}
            label={title}
          />
          <label
            truncate={true}
            halign={START}
            label={artist}
            className="artist"
          />
          <label
            truncate={true}
            halign={START}
            label={album}
            className="album"
          />
        </box>
      </box>

      <box className="seek" vertical={false}>
        <label
          halign={START}
          visible={bind(player, "length").as((l) => l > 0)}
          label={realPosition().as(lengthStr)}
        />
        <slider
          className="slider"
          hexpand={true}
          visible={bind(player, "length").as((l) => l > 0)}
          onDragged={({ value }) => {
            player.position = value * player.length;
            realPosition.set(player.position);
          }}
          value={realPosition().as((position) => {
            return player.length > 0 ? position / player.length : 0;
          })}
        />
        <label
          halign={END}
          visible={bind(player, "length").as((l) => l > 0)}
          label={bind(player, "length").as((l) =>
            l > 0 ? lengthStr(l) : "0:00",
          )}
        />
      </box>
      <box halign={CENTER} className="controls">
        <button
          className="controlButton"
          onClicked={() => {
            if (player.shuffleStatus === Mpris.Shuffle.ON) {
              player.set_shuffle_status(Mpris.Shuffle.OFF);
            } else {
              player.set_shuffle_status(Mpris.Shuffle.ON);
            }
          }}
          visible={bind(player, "shuffleStatus").as(
            (shuffle) => shuffle !== Mpris.Shuffle.UNSUPPORTED,
          )}
          label={bind(player, "shuffleStatus").as((shuffle) => {
            if (shuffle === Mpris.Shuffle.ON) {
              return "";
            } else {
              return "󰒞";
            }
          })}
        />
        <button
          className="controlButton"
          onClicked={() => player.previous()}
          visible={bind(player, "canGoPrevious")}
          label=""
        />
        <button
          className="controlButton"
          onClicked={() => player.play_pause()}
          visible={bind(player, "canControl")}
          label={playIcon}
        />
        <button
          className="controlButton"
          onClicked={() => player.next()}
          visible={bind(player, "canGoNext")}
          label=""
        />
        <button
          className="controlButton"
          onClicked={() => {
            if (player.loopStatus === Mpris.Loop.NONE) {
              player.set_loop_status(Mpris.Loop.PLAYLIST);
            } else if (player.loopStatus === Mpris.Loop.PLAYLIST) {
              player.set_loop_status(Mpris.Loop.TRACK);
            } else {
              player.set_loop_status(Mpris.Loop.NONE);
            }
          }}
          visible={bind(player, "loopStatus").as(
            (status) => status !== Mpris.Loop.UNSUPPORTED,
          )}
          label={bind(player, "loopStatus").as((status) => {
            if (status === Mpris.Loop.NONE) {
              return "󰑗";
            } else if (status === Mpris.Loop.PLAYLIST) {
              return "󰑖";
            } else {
              return "󰑘";
            }
          })}
        />
      </box>
    </box>
  );
}

export default function ({ gdkmonitor, opts }: { gdkmonitor?: Gdk.Monitor, opts?: any }) {
  const mpris = Mpris.get_default();
  return (
    <box>
      {bind(mpris, "players").as((players) => {
        return players.map((player) => (
          <button
            className="panelButton mediaPlayer"
            onClicked={() => {
              togglePopup(
                "mediaPlayer",
                Astal.WindowAnchor.BOTTOM,
                <MediaPlayer player={player} />,
              );
            }}
          >
            <MediaPlayerWidget player={player} />
          </button>
        ));
      })}
    </box>
  );
}
