/* Audio sintético original. No requiere archivos ni servicios externos. */
(function(){
  let ctx=null,master=null,rain=null,hums=[],muted=false;
  const Audio={
    init(){
      if(ctx){ctx.resume().catch(()=>{});return;}
      try{
        const A=window.AudioContext||window.webkitAudioContext;
        if(!A)return;
        ctx=new A();master=ctx.createGain();master.gain.value=muted?0:0.23;master.connect(ctx.destination);
        const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);
        for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1);
        rain=ctx.createBufferSource();rain.buffer=b;rain.loop=true;
        const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=800;
        const rg=ctx.createGain();rg.gain.value=.06;
        rain.connect(lp).connect(rg).connect(master);rain.start();
        for(const [freq,level] of [[56,.036],[112,.009],[144,.011]]){
          const o=ctx.createOscillator();o.type='triangle';o.frequency.value=freq;
          const g=ctx.createGain();g.gain.value=level;o.connect(g).connect(master);o.start();hums.push(o);
        }
      }catch(err){console.warn('Audio unavailable',err);ctx=null;}
    },
    mute(value){muted=value;if(master&&ctx)master.gain.setTargetAtTime(muted?0:.23,ctx.currentTime,.04);},
    isMuted(){return muted;},
    tone(freq=440,len=.08,type='sine',volume=.1,detune=0){
      if(!ctx||muted)return;
      const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
      o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+detune),now+len);
      g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+len);
      o.connect(g).connect(master);o.start(now);o.stop(now+len+.02);
    },
    click(){this.tone(650,.055,'square',.05,-160);},
    knock(){this.tone(93,.18,'triangle',.42,-35);setTimeout(()=>this.tone(89,.18,'triangle',.31,-40),145);},
    good(){this.tone(395,.16,'sine',.17,30);setTimeout(()=>this.tone(590,.24,'sine',.12,10),120);},
    bad(){this.tone(160,.34,'sawtooth',.17,-100);setTimeout(()=>this.tone(65,.45,'triangle',.14,-20),130);},
    spooky(){this.tone(80,.9,'sawtooth',.10,38);this.tone(72,1.5,'triangle',.10,-28);},
    type(){this.tone(800,.02,'square',.015,-300);}
  };
  window.Room404Audio=Audio;
})();